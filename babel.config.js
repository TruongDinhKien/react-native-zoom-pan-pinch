module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              'react-native-zoom-pan-pinch': './src/index',
              '@': './src',
              '@/types': './src/types',
              '@/constants': './src/constants.ts',
              '@/components/core': './src/components/core',
              '@/utils': './src/utils/index.ts',
              '@/libs': './src/libs/index.ts',
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          },
        ],
      ],
    },

    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
};
