const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure Metro treats .wasm files as assets for expo-sqlite web support
config.resolver.assetExts.push('wasm');

module.exports = config;

