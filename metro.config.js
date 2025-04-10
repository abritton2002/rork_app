const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Optimize Metro Bundler
config.maxWorkers = 4;
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
  },
};

// Optimize asset loading
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config; 