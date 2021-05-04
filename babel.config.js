module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          root: './src',
          react: './node_modules/react',
          '^react-native$': './node_modules/react-native',
          '@babel/runtime': './node_modules/@babel/runtime',
          'styled-components': './node_modules/styled-components',
          'react-native-reanimated': './node_modules/react-native-reanimated',
          'react-native-gesture-handler': './node_modules/react-native-gesture-handler',
          worklets: './src/worklets',
          constants: './src/constants',
          components: './src/components',
          hocs: './src/hocs',
        },
        extensions: ['.ts', '.tsx', '.js', 'cjs', '.ios.js', '.android.js', '.web.js'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
