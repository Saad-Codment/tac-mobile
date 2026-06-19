package com.tac.codment

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import io.branch.rnbranch.RNBranchModule

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            // Force disable New Architecture
            override val isNewArchEnabled: Boolean = false

            // Keep Hermes as you had it
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = DefaultReactHost.getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()

        // Safe SoLoader initialization for RN 0.75+
        SoLoader.init(this, OpenSourceMergedSoMapping)

        // Initialize Branch.io
        RNBranchModule.getAutoInstance(this)

        // IMPORTANT: Do NOT call DefaultNewArchitectureEntryPoint.load() here
        // We have disabled New Arch completely above
    }
}