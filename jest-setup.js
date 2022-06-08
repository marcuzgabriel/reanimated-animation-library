/* NOTE: https://github.com/software-mansion/react-native-reanimated/issues/1380
When testing react-native-gesture-handler together with react-native-reanimated,
then the following error appears:
return global.ReanimatedDataMock.now();
TypeError: Cannot read properties of undefined (reading 'now')
*/

/* eslint-disable no-undef */
global.__reanimatedWorkletInit = jest.fn();
global.ReanimatedDataMock = {
  now: jest.fn(),
};

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  let platform = {
    OS: 'ios',
  };

  const select = jest.fn().mockImplementation(obj => {
    const value = obj[platform.OS];
    return !value ? obj.default : value;
  });

  platform.select = select;

  return platform;
});

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
require('react-native-gesture-handler/jestSetup.js');
/* eslint-enable no-undef */
