const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    unstable_enablePackageExports: false, // ← fixes many "default"/"S" errors in 0.79
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
