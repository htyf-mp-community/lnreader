module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@database': './src/database',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@strings': './strings',
            '@redux': './src/redux',
            '@services': './src/services',
            '@sources': './src/sources',
            '@utils': './src/utils',
            '@theme': './src/theme',
          },
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
