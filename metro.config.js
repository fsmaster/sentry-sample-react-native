const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');

/**
 * withSentryConfig adds a Debug ID to the bundle and its source map,
 * this is how Sentry matches them later.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withSentryConfig(mergeConfig(getDefaultConfig(__dirname), config));
