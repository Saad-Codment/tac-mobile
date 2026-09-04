package com.tac.codment.navigation

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * Registers TacNavigationModule as a plain (legacy-bridge) native module.
 * New Architecture is disabled project-wide (MainApplication.isNewArchEnabled
 * = false), so this uses the classic ReactPackage/NativeModule registration
 * — the same approach already used by every autolinked native module in
 * this app — rather than a TurboModule, per the instruction to use
 * whatever fits the project's existing architecture instead of migrating
 * just for this feature.
 */
class TacNavigationPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(TacNavigationModule(reactContext))

    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
