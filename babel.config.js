module.exports = function (api) {
  api.cache(true);
  return {
    // Use Expo preset only; configure css-interop + JSX via plugins
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind uses react-native-css-interop under the hood; add its babel plugin directly
      require('react-native-css-interop/dist/babel-plugin').default,
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'react-native-css-interop',
        },
      ],
      // Reanimated v3 plugin must be last
      'react-native-reanimated/plugin',
    ],
  };
};
