/* NOTE: https://github.com/software-mansion/react-native-reanimated/issues/1380 */
global.__reanimatedWorkletInit = jest.fn();

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
require('react-native-gesture-handler/jestSetup');
