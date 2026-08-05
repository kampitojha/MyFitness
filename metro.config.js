const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force tslib to resolve to the CJS build so Metro doesn't break
// on `const { __extends } = tslib.default` (which is undefined in ESM).
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.js'),
};

module.exports = withNativeWind(config, { input: './src/global.css' });