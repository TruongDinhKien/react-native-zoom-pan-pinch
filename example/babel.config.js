const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  const config = getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );

  config.plugins = [
    ...(config.plugins || []),
    [
      'module-resolver',
      {
        root: [path.resolve(root, 'src')],
        alias: {
          'react-native-zoom-pan-pinch': path.resolve(root, 'src/index'),
          '@': path.resolve(root, 'src'),
          '@/types': path.resolve(root, 'src/types'),
          '@/constants': path.resolve(root, 'src/constants.ts'),
          '@/components/core': path.resolve(root, 'src/components/core'),
          '@/utils': path.resolve(root, 'src/utils/index.ts'),
          '@/libs': path.resolve(root, 'src/libs/index.ts'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ];

  return config;
};
