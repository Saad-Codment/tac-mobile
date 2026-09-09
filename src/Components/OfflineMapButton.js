import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {TextComponent} from '../Components/TextComponent';
import {Touchable} from '../Components/Touchable';
import {hp, wp} from '../Config/responsive';
import {
  boundsForTripOrRoute,
  downloadTripRegion,
  getTripRegionStatus,
  deleteTripRegion,
  describeOfflineMapError,
} from '../Utils/OfflineMapManager';
import {getNativeNavigationEngine} from '../Services/Navigation/NavigationEngine';

// NEW — Step 5/6/7: "Map data" (Maps SDK tiles, above) and "Navigation/
// routing data" (Navigation SDK tiles, this section) are DISTINCT
// downloads tracked separately, per TacNavigationModule.swift/.kt's own
// isOfflineNavigationReady — a downloaded map pack alone never implies
// navigation readiness. This section only renders at all when the
// native Navigation SDK module is actually linked (`nativeEngine` below)
// — no fabricated "ready" state on a build that doesn't have it.
const OfflineMapButton = ({tripId, stops, routeGeoJSON}) => {
  const [status, setStatus] = useState({exists: false});
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  // NEW — set when the region had to be downloaded at a lower max
  // zoom than requested to fit Mapbox's tile cap. Shown honestly
  // rather than silently downloading something different from what
  // was asked.
  const [zoomNotice, setZoomNotice] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const nativeEngine = getNativeNavigationEngine();
  const [navReady, setNavReady] = useState(false);
  const [isDownloadingNav, setIsDownloadingNav] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [navError, setNavError] = useState(null);

  const refreshStatus = useCallback(async () => {
    if (!tripId) return;
    const result = await getTripRegionStatus(tripId);
    setStatus(result);
  }, [tripId]);

  const refreshNavStatus = useCallback(async () => {
    if (!tripId || !nativeEngine) return;
    setNavReady(await nativeEngine.isOfflineNavigationReady(tripId));
  }, [tripId, nativeEngine]);

  useEffect(() => {
    refreshStatus();
    refreshNavStatus();
  }, [refreshStatus, refreshNavStatus]);

  const handleDownloadNav = async () => {
    if (!nativeEngine || !routeGeoJSON) return;
    setIsDownloadingNav(true);
    setNavProgress(0);
    setNavError(null);
    const result = await nativeEngine.downloadNavigationRegion({
      tripId,
      routeGeoJSON,
      onProgress: p => {
        const required = p?.requiredResourceCount || 1;
        setNavProgress(
          Math.round(((p?.completedResourceCount || 0) / required) * 100),
        );
      },
    });
    setIsDownloadingNav(false);
    if (result?.unavailable) {
      setNavError(
        result.reason === 'no_route_geometry'
          ? 'Route not calculated yet — open the trip route once, then try again.'
          : 'Could not download navigation data. Try again, or check your connection.',
      );
      return;
    }
    refreshNavStatus();
  };

  const handleRemoveNav = async () => {
    if (!nativeEngine) return;
    await nativeEngine.removeNavigationRegion(tripId);
    refreshNavStatus();
  };

  const handleDownload = () => {
    // Route-focused first: a bounding box derived from the trip's actual
    // route path (tighter, doesn't balloon for a long trip with widely
    // spaced stops) \u2014 falls back to a box over the stops only when the
    // trip has no route geometry yet. See OfflineMapManager.boundsForTripOrRoute.
    const bounds = boundsForTripOrRoute(routeGeoJSON, stops);
    if (!bounds) return;

    setIsDownloading(true);
    setProgress(0);
    setZoomNotice(null);
    setDownloadError(null);

    downloadTripRegion({
      tripId,
      bounds,
      onZoomAdjusted: ({actualMaxZoom}) => {
        setZoomNotice(
          `Downloaded at a reduced detail level (up to zoom ${actualMaxZoom}) to fit this trip\u2019s area within Mapbox\u2019s offline size limit.`,
        );
      },
      onProgress: s => setProgress(Math.round(s?.percentage ?? 0)),
      onComplete: (region, {wasOptimizedRetry} = {}) => {
        setIsDownloading(false);
        // CHANGED \u2014 Mapbox actually rejected the first attempt (the real
        // 750-tile-pack cap, not just the local heuristic) and TAC
        // automatically retried with the optimized profile, which
        // succeeded. Shown as a subtle, non-blocking notice \u2014 the
        // download itself already completed successfully.
        if (wasOptimizedRetry) {
          setZoomNotice('Offline map optimized for this trip');
        }
        refreshStatus();
      },
      onError: (err, meta) => {
        setIsDownloading(false);
        // CHANGED \u2014 never show the raw Mapbox error (tile IDs, 750/800
        // counts) to the user. This only fires after TAC has already
        // tried the automatic optimized retry (see downloadTripRegion) \u2014
        // meta.wasOptimized tells the translated message whether to
        // mention that.
        setDownloadError(describeOfflineMapError(err, meta));
      },
    });
  };

  const handleRemove = async () => {
    await deleteTripRegion(tripId);
    setZoomNotice(null);
    refreshStatus();
  };

  let mapSection;
  if (isDownloading) {
    mapSection = (
      <View style={S.container}>
        <ActivityIndicator size="small" color="#2563EB" />
        <TextComponent
          text={`Downloading map... ${progress}%`}
          styles={S.text}
        />
      </View>
    );
  } else if (downloadError) {
    // CHANGED — downloadError is now the translated {title, message}
    // shape from describeOfflineMapError, never a raw Mapbox string.
    mapSection = (
      <View style={[S.container, S.errorContainer, S.errorColumn]}>
        <View style={S.errorTextWrap}>
          <TextComponent
            text={downloadError.title}
            styles={[S.text, S.errorText, S.errorTitle]}
          />
          <TextComponent
            text={downloadError.message}
            fade
            styles={S.errorMessage}
            numberOfLines={4}
          />
        </View>
        {downloadError.canRetry && (
          <Touchable onPress={handleDownload} style={S.retryBtn}>
            <TextComponent text={'Retry'} styles={S.retryBtnText} />
          </Touchable>
        )}
      </View>
    );
  } else if (status.exists && status.complete) {
    mapSection = (
      <View>
        <Touchable onPress={handleRemove} style={[S.container, S.downloaded]}>
          <TextComponent text={'✓'} styles={S.checkIcon} />
          <TextComponent
            text={'Map downloaded for offline use'}
            styles={S.text}
          />
          <TextComponent text={'Remove'} styles={S.removeText} />
        </Touchable>
        {zoomNotice && (
          <TextComponent
            text={zoomNotice}
            fade
            styles={S.zoomNotice}
            numberOfLines={3}
          />
        )}
      </View>
    );
  } else {
    mapSection = (
      <Touchable onPress={handleDownload} style={S.container}>
        <TextComponent text={'⬇️'} styles={S.icon} />
        <TextComponent text={'Download map for offline use'} styles={S.text} />
      </Touchable>
    );
  }

  // NEW — Navigation/routing data section, entirely separate from the
  // map-tile section above. Only rendered when the native Navigation SDK
  // module is actually linked (`nativeEngine`) — nothing fabricated for
  // builds without it.
  let navSection = null;
  if (nativeEngine) {
    if (isDownloadingNav) {
      navSection = (
        <View style={[S.container, S.navContainer]}>
          <ActivityIndicator size="small" color="#7C3AED" />
          <TextComponent
            text={`Downloading navigation data... ${navProgress}%`}
            styles={S.text}
          />
        </View>
      );
    } else if (navError) {
      navSection = (
        <View style={[S.container, S.navContainer, S.errorContainer]}>
          <TextComponent text={'⚠️'} styles={S.icon} />
          <TextComponent
            text={navError}
            styles={[S.text, S.errorText]}
            numberOfLines={3}
          />
        </View>
      );
    } else if (navReady) {
      navSection = (
        <Touchable
          onPress={handleRemoveNav}
          style={[S.container, S.navContainer, S.downloaded]}>
          <TextComponent text={'✓'} styles={S.checkIcon} />
          <TextComponent text={'Offline Navigation Ready'} styles={S.text} />
          <TextComponent text={'Remove'} styles={S.removeText} />
        </Touchable>
      );
    } else {
      navSection = (
        <Touchable
          onPress={handleDownloadNav}
          disabled={!routeGeoJSON}
          style={[S.container, S.navContainer]}>
          <TextComponent text={'🧭'} styles={S.icon} />
          <TextComponent
            text={
              routeGeoJSON
                ? 'Download navigation data for offline routing'
                : 'Open the trip route once to enable offline navigation download'
            }
            styles={S.text}
            numberOfLines={2}
          />
        </Touchable>
      );
    }
  }

  return (
    <View>
      {mapSection}
      {navSection}
    </View>
  );
};

const S = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2'),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.2'),
  },
  downloaded: {backgroundColor: '#F0FDF4', borderColor: '#BBF7D0'},
  navContainer: {marginTop: hp('1')},
  errorContainer: {backgroundColor: '#FEF2F2', borderColor: '#FECACA'},
  icon: {fontSize: hp('1.4')},
  checkIcon: {fontSize: hp('1.4'), color: '#16A34A', fontWeight: '700'},
  text: {
    flex: 1,
    fontSize: hp('1.3'),
    color: '#334155',
    fontWeight: '600',
  },
  errorText: {color: '#B91C1C', fontWeight: '500'},
  errorColumn: {alignItems: 'flex-start', flexDirection: 'column'},
  errorTextWrap: {width: '100%'},
  errorTitle: {flex: 0},
  errorMessage: {
    fontSize: hp('1.15'),
    color: '#B91C1C',
    marginTop: hp('0.3'),
    lineHeight: hp('1.6'),
  },
  retryBtn: {
    marginTop: hp('1'),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.5'),
  },
  retryBtnText: {fontSize: hp('1.15'), color: '#B91C1C', fontWeight: '700'},
  removeText: {fontSize: hp('1.2'), color: '#EF4444', fontWeight: '700'},
  // NEW
  zoomNotice: {
    fontSize: hp('1.05'),
    color: '#94A3B8',
    marginTop: hp('0.6'),
    paddingHorizontal: wp('1'),
    lineHeight: hp('1.5'),
  },
});

export default OfflineMapButton;
