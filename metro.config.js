const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Deduplicate tslib to fix SSR compatibility with moti/reanimated
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    tslib: path.resolve(__dirname, 'node_modules/tslib'),
  },
};

module.exports = withNativeWind(config, { input: './src/global.css' });