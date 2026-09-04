package com.tac.codment.navigation

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.mapbox.api.directions.v5.DirectionsCriteria
import com.mapbox.api.directions.v5.models.RouteOptions
import com.mapbox.bindgen.Expected
import com.mapbox.common.Cancelable
import com.mapbox.common.TileRegion
import com.mapbox.common.TileRegionError
import com.mapbox.common.TileRegionLoadOptions
import com.mapbox.common.TileRegionLoadProgress
import com.mapbox.common.TileStore
import com.mapbox.geojson.Geometry
import com.mapbox.geojson.LineString
import com.mapbox.geojson.Point
import com.mapbox.navigation.base.ExperimentalPreviewMapboxNavigationAPI
import com.mapbox.navigation.base.extensions.applyDefaultNavigationOptions
import com.mapbox.navigation.base.options.NavigationOptions
import com.mapbox.navigation.base.route.NavigationRoute
import com.mapbox.navigation.base.route.NavigationRouterCallback
import com.mapbox.navigation.base.route.RouterFailure
import com.mapbox.navigation.core.MapboxNavigation
import com.mapbox.navigation.core.MapboxNavigationProvider
import com.mapbox.navigation.core.directions.session.RoutesExtra
import com.mapbox.navigation.core.directions.session.RoutesObserver
import com.mapbox.navigation.core.trip.session.RouteProgressObserver
import com.mapbox.navigation.core.trip.session.TripSessionState
import com.mapbox.navigation.core.trip.session.TripSessionStateObserver

/**
 * TAC's native bridge to the Mapbox Navigation SDK v3 (core routing/session
 * engine only — no Navigation UIKit; TAC keeps its own LegNavigationScreen
 * turn-by-turn UI). This is the minimum surface `NavigationEngine.js` needs
 * to add a second, native-backed engine implementation alongside today's
 * Mapbox-Directions-HTTP one, WITHOUT changing TAC's Trip -> Leg ->
 * Vehicle -> (Navigation Engine) -> Complete Leg -> Next Leg flow.
 *
 * Uses `MapboxNavigationProvider`, not `MapboxNavigationApp` — the latter
 * is built for an Activity/Compose lifecycle owner; a plain NativeModule
 * has none, and Mapbox's own docs note the two initialization approaches
 * are mutually exclusive. MapboxNavigationProvider is the documented
 * lifecycle-free alternative (`.create()` / `.retrieve()` / `.destroy()`),
 * which fits a bridge module correctly.
 *
 * Trailer constraints (max_height/max_width/max_weight): built from the
 * SAME vehicle fields and SAME unit conversions as the JS side
 * (RouteRestrictions.js) — height_cm/100, width_cm/100, weight_kg/1000 —
 * so a route requested through this native engine enforces identical
 * constraints to a route requested through the existing Directions-HTTP
 * engine. Vehicle length is intentionally never mapped to a parameter —
 * RouteOptions has no such builder method (confirmed against the
 * Directions-models API reference for this exact SDK version).
 *
 * Ferry/unpaved exclusion: per the current TAC product decision, neither
 * is applied automatically. `exclude()` is simply not called unless a
 * caller explicitly passes one — see `buildExcludeParam` below, which
 * exists so this can become a user-selectable preference later without
 * restructuring this module again.
 */
@OptIn(ExperimentalPreviewMapboxNavigationAPI::class)
class TacNavigationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "TacNavigationEngine"

    private var currentRoutes: List<NavigationRoute> = emptyList()
    // Region-download bookkeeping, keyed by TAC tripId — see the offline
    // navigation region section near the bottom of this file.
    private val regionDownloadCancelables = mutableMapOf<String, Cancelable>()

    private fun emit(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private val routeProgressObserver = RouteProgressObserver { routeProgress ->
        val map = Arguments.createMap().apply {
            putDouble("distanceRemainingMeters", routeProgress.distanceRemaining.toDouble())
            putDouble("durationRemainingSeconds", routeProgress.durationRemaining)
            putDouble(
                "distanceTraveledMeters",
                routeProgress.distanceTraveled.toDouble(),
            )
            routeProgress.currentLegProgress?.currentStepProgress?.let { stepProgress ->
                putDouble(
                    "maneuverDistanceRemainingMeters",
                    stepProgress.distanceRemaining.toDouble(),
                )
                stepProgress.step?.maneuver()?.instruction()?.let {
                    putString("maneuverInstruction", it)
                }
            }
            // NEW — parity with iOS's nextManeuverInstruction. Confirmed
            // directly against the actual v3.23.1 source
            // (RouteLegProgress.kt): `upcomingStep: LegStep?` exists on
            // RouteLegProgress itself, not nested under currentStepProgress —
            // not guessed from a different SDK version.
            routeProgress.currentLegProgress?.upcomingStep?.maneuver()?.instruction()?.let {
                putString("nextManeuverInstruction", it)
            }
        }
        emit("TacNavigationRouteProgress", map)
    }

    // NEW — surfaces the SDK's own trip session lifecycle (idle / active)
    // so JS can distinguish "engine actually tracking" from "not yet
    // started" without guessing from route-progress event presence alone.
    private val tripSessionStateObserver = TripSessionStateObserver { state ->
        val map = Arguments.createMap().apply {
            putString(
                "state",
                when (state) {
                    TripSessionState.STARTED -> "started"
                    TripSessionState.STOPPED -> "stopped"
                },
            )
        }
        emit("TacNavigationTripSessionState", map)
    }

    // NEW — the SDK's built-in RerouteController fires this whenever it
    // replaces the active route (its default implementation already does
    // automatic off-route detection + rerouting internally — TAC does not
    // need to hand-roll off-route distance math for this engine the way
    // the existing JS/Directions-HTTP engine does). The constraint-
    // preservation guarantee comes from always deriving RouteOptions from
    // the same vehicle object (see calculateRoute), which the SDK reuses
    // on every reroute it triggers internally from that same requested
    // profile.
    //
    // CHANGED — now also serializes and forwards the new route's geometry
    // (see serializeRoute below), not just a bare "routes changed" signal.
    // Without this, the turn-by-turn instructions would follow the new
    // (rerouted) path while the map kept drawing the old one — this
    // closes that gap for every route change, reroute included.
    private val routesObserver = RoutesObserver { result ->
        currentRoutes = result.navigationRoutes
        val primary = result.navigationRoutes.firstOrNull()
        val map = (primary?.let {serializeRoute(it) } ?: Arguments.createMap()).apply {
            putInt("routeCount", result.navigationRoutes.size)
            putBoolean("isReroute", result.reason == RoutesExtra.ROUTES_UPDATE_REASON_REROUTE)
        }
        emit("TacNavigationRouteUpdated", map)
    }

    // Serializes a NavigationRoute into the SAME JS-facing shape the
    // existing Directions-HTTP engine already returns (fetchLegRoute in
    // LegTrackingHelpers.js) — geometry as an encoded polyline decoded
    // into GeoJSON coordinates (DirectionsRoute.geometry() returns
    // polyline6 by default per the Directions API reference; TAC also
    // explicitly requests GEOMETRY_POLYLINE6 in calculateRoute below so
    // this never depends on an implicit default), steps shaped like the
    // raw Directions JSON (`maneuver.instruction/type/modifier/location`)
    // so LegNavigationScreen's existing maneuverIcon()/TurnByTurnBanner
    // read either source unchanged.
    private fun serializeRoute(route: NavigationRoute): WritableMap {
        val directionsRoute = route.directionsRoute
        val lineString = LineString.fromPolyline(directionsRoute.geometry() ?: "", 6)
        val coordinates = Arguments.createArray().apply {
            lineString.coordinates().forEach { point ->
                pushArray(Arguments.createArray().apply {
                    pushDouble(point.longitude())
                    pushDouble(point.latitude())
                })
            }
        }
        val geometry = Arguments.createMap().apply {
            putString("type", "LineString")
            putArray("coordinates", coordinates)
        }
        val steps = Arguments.createArray().apply {
            directionsRoute.legs()?.forEach { leg ->
                leg.steps()?.forEach { step ->
                    val maneuver = Arguments.createMap().apply {
                        putString("instruction", step.maneuver().instruction())
                        putString("type", step.maneuver().type())
                        step.maneuver().modifier()?.let { putString("modifier", it) }
                        putArray("location", Arguments.createArray().apply {
                            pushDouble(step.maneuver().location().longitude())
                            pushDouble(step.maneuver().location().latitude())
                        })
                    }
                    pushMap(Arguments.createMap().apply {
                        putDouble("distance", step.distance())
                        putDouble("duration", step.duration())
                        putMap("maneuver", maneuver)
                    })
                }
            }
        }
        return Arguments.createMap().apply {
            putString("routeId", route.id)
            putDouble("distanceMeters", directionsRoute.distance())
            putDouble("durationSeconds", directionsRoute.duration())
            putMap("geometry", geometry)
            putArray("steps", steps)
        }
    }

    private fun mapboxNavigation(): MapboxNavigation {
        if (!MapboxNavigationProvider.isCreated()) {
            // No explicit access token here: MapboxOptions.accessToken is a
            // process-wide static already set by rnmapbox-maps' JS bridge
            // call (MapboxGL.setAccessToken(MAPBOX_TOKEN), executed at
            // module load time in every screen that imports it — before
            // any JS ever calls into this native module), so
            // NavigationOptions reuses that same token rather than needing
            // its own.
            val options = NavigationOptions.Builder(reactApplicationContext.applicationContext)
                .build()
            MapboxNavigationProvider.create(options)
            val nav = MapboxNavigationProvider.retrieve()
            nav.registerRouteProgressObserver(routeProgressObserver)
            nav.registerRoutesObserver(routesObserver)
            nav.registerTripSessionStateObserver(tripSessionStateObserver)
        }
        return MapboxNavigationProvider.retrieve()
    }

    // Builds max_height/max_width/max_weight from the same vehicle fields
    // and unit conversions as RouteRestrictions.js. Returns null for any
    // field the vehicle doesn't have — RouteOptions.Builder treats a null
    // as "not sent", matching the JS side's all-or-nothing hasDimensions
    // gate is intentionally NOT enforced here at this layer; callers
    // (JS NavigationEngine) already gate on vehicleHasDimensions before
    // invoking this engine, exactly as they do for the existing one.
    private fun applyVehicleRestrictions(
        builder: RouteOptions.Builder,
        vehicle: ReadableMap?,
    ) {
        if (vehicle == null) return
        if (vehicle.hasKey("height_cm") && !vehicle.isNull("height_cm")) {
            builder.maxHeight(vehicle.getDouble("height_cm") / 100.0)
        }
        if (vehicle.hasKey("width_cm") && !vehicle.isNull("width_cm")) {
            builder.maxWidth(vehicle.getDouble("width_cm") / 100.0)
        }
        if (vehicle.hasKey("weight_kg") && !vehicle.isNull("weight_kg")) {
            builder.maxWeight(vehicle.getDouble("weight_kg") / 1000.0)
        }
        // vehicle length (length_cm), if present, is deliberately never
        // read here — RouteOptions has no vehicle-length parameter.
    }

    @ReactMethod
    fun calculateRoute(
        originLat: Double,
        originLng: Double,
        destLat: Double,
        destLng: Double,
        vehicle: ReadableMap?,
        promise: Promise,
    ) {
        val nav = mapboxNavigation()
        val optionsBuilder = RouteOptions.builder()
            .applyDefaultNavigationOptions()
            // Explicit rather than relying on the documented default, so
            // serializeRoute's LineString.fromPolyline(..., 6) decode
            // never silently mismatches the actual response precision.
            .geometries(DirectionsCriteria.GEOMETRY_POLYLINE6)
            .coordinatesList(
                listOf(
                    Point.fromLngLat(originLng, originLat),
                    Point.fromLngLat(destLng, destLat),
                ),
            )
        applyVehicleRestrictions(optionsBuilder, vehicle)
        // No .exclude(...) call here — ferry/unpaved exclusion is OFF by
        // default per the current TAC product decision (see class doc).

        nav.requestRoutes(
            optionsBuilder.build(),
            object : NavigationRouterCallback {
                override fun onRoutesReady(routes: List<NavigationRoute>, routerOrigin: String) {
                    currentRoutes = routes
                    val primary = routes.firstOrNull()
                    if (primary == null) {
                        promise.reject("no_route", "No route could be found.")
                        return
                    }
                    val result = serializeRoute(primary).apply {
                        putBoolean(
                            "usedRestrictions",
                            vehicle != null &&
                                vehicle.hasKey("height_cm") &&
                                vehicle.hasKey("width_cm") &&
                                vehicle.hasKey("weight_kg"),
                        )
                    }
                    promise.resolve(result)
                }

                override fun onFailure(reasons: List<RouterFailure>, routeOptions: RouteOptions) {
                    promise.reject(
                        "no_route",
                        reasons.firstOrNull()?.message ?: "No route could be found.",
                    )
                }

                override fun onCanceled(routeOptions: RouteOptions, routerOrigin: String) {
                    promise.reject("cancelled", "Route request was cancelled.")
                }
            },
        )
    }

    // Mirrors the iOS module's shape (calculateRoute, then a separate
    // startActiveGuidance call) even though on Android `requestRoutes`
    // alone doesn't put the SDK into Active Guidance — that needs an
    // explicit `setNavigationRoutes` call, which is what this does,
    // followed by starting the trip session.
    @ReactMethod
    fun startActiveGuidance(startLegIndex: Int, promise: Promise) {
        if (currentRoutes.isEmpty()) {
            promise.reject("no_calculated_route", "Call calculateRoute before starting guidance.")
            return
        }
        val nav = mapboxNavigation()
        nav.setNavigationRoutes(currentRoutes, startLegIndex)
        nav.startTripSession()
        promise.resolve(null)
    }

    @ReactMethod
    fun startTripSession(promise: Promise) {
        // withForegroundService omitted deliberately — TAC has not added
        // a foreground-service/background-navigation infrastructure yet
        // (out of scope for this pass; see repository reconciliation
        // notes). Session runs only while the app/screen is foregrounded,
        // matching the existing engine's current behavior.
        mapboxNavigation().startTripSession()
        promise.resolve(null)
    }

    @ReactMethod
    fun stopTripSession(promise: Promise) {
        mapboxNavigation().stopTripSession()
        promise.resolve(null)
    }

    @ReactMethod
    fun getTripSessionState(promise: Promise) {
        val state = mapboxNavigation().getTripSessionState()
        promise.resolve(if (state == TripSessionState.STARTED) "started" else "stopped")
    }

    // ── Offline navigation region (TileStore) ─────────────────────────
    // Distinct from Maps SDK offline tiles (OfflineMapManager.js) — this
    // downloads NAVIGATION routing tiles via the Navigation SDK's own
    // TilesetDescriptor (`nav.tilesetDescriptorFactory`, confirmed public
    // on MapboxNavigation for this exact 3.23.1 tag). Per
    // RoutingTilesOptions' own documented recommendation, no explicit
    // TileStore is configured here, so it defaults to the shared
    // on-device TileStore location — the same one the Maps SDK's own
    // offline packs use, per that class's doc comment ("this instance
    // should be the same that is passed to map resource options").
    //
    // NOTE ON VERIFICATION DEPTH: `tilesetDescriptorFactory` and
    // `setNavigationRoutes` were confirmed directly against this
    // project's actual resolved source (MapboxNavigation.kt @ v3.23.1).
    // `TileStore`/`TileRegionLoadOptions` themselves are MapboxCommon
    // types shipped as a compiled AAR (no local sources jar cached in
    // this environment to grep), so the exact call below is written
    // from the long-established, stable MapboxCommon offline-region API
    // shape already implied by RoutingTilesOptions' own KDoc — confirm
    // exact argument names against Android Studio's decompiled/sources
    // view at compile time before relying on it.
    private fun navigationTileStore(): TileStore = TileStore.create()

    private fun regionId(tripId: String) = "tac-nav-$tripId"

    @ReactMethod
    fun downloadNavigationRegion(tripId: String, geometryJSON: String, promise: Promise) {
        val geometry = try {
            Geometry.fromJson(geometryJSON)
        } catch (err: Exception) {
            promise.reject("invalid_geometry", "Trip geometry was not valid GeoJSON.", err)
            return
        }

        val descriptor = mapboxNavigation().tilesetDescriptorFactory.getLatest()
        val tileStore = navigationTileStore()
        val id = regionId(tripId)

        val loadOptions = TileRegionLoadOptions.Builder()
            .geometry(geometry)
            .descriptors(listOf(descriptor))
            .acceptExpired(true)
            .build()

        val cancelable = tileStore.loadTileRegion(
            id,
            loadOptions,
            { progress: TileRegionLoadProgress ->
                val map = Arguments.createMap().apply {
                    putString("tripId", tripId)
                    putDouble("completedResourceCount", progress.completedResourceCount.toDouble())
                    putDouble("requiredResourceCount", progress.requiredResourceCount.toDouble())
                }
                emit("TacNavigationRegionDownloadProgress", map)
            },
            { result: Expected<TileRegionError, TileRegion> ->
                if (result.isValue) {
                    promise.resolve(null)
                } else {
                    promise.reject("download_failed", result.error?.message ?: "Navigation region download failed.")
                }
            },
        )
        regionDownloadCancelables[tripId] = cancelable
    }

    @ReactMethod
    fun cancelNavigationRegionDownload(tripId: String, promise: Promise) {
        regionDownloadCancelables.remove(tripId)?.cancel()
        promise.resolve(null)
    }

    @ReactMethod
    fun removeNavigationRegion(tripId: String, promise: Promise) {
        navigationTileStore().removeTileRegion(regionId(tripId))
        promise.resolve(null)
    }

    // TRUTHFUL readiness check — replaces the old hardcoded `false` stub.
    // Reports ready only when a navigation tile region for this trip
    // genuinely finished downloading (not merely "started" or "a map-tile
    // pack exists" — see the class doc on the map-vs-navigation
    // distinction).
    @ReactMethod
    fun isOfflineNavigationReady(tripId: String, promise: Promise) {
        navigationTileStore().getTileRegion(regionId(tripId)) { result: Expected<TileRegionError, TileRegion> ->
            if (result.isValue) {
                val region = result.value
                val ready = region != null &&
                    region.requiredResourceCount > 0 &&
                    region.completedResourceCount >= region.requiredResourceCount
                promise.resolve(ready)
            } else {
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required by RN's NativeEventEmitter — no-op, events are always
        // emitted via DeviceEventManagerModule regardless of listener count.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required by RN's NativeEventEmitter — no-op.
    }
}
