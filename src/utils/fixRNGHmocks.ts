'use strict';

/* Fixing issue: https://github.com/software-mansion/react-native-gesture-handler/issues/2007 */

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _reactNative = require('react-native');

var _State = require('react-native-gesture-handler/lib/commonjs/State');

var _Directions = require('react-native-gesture-handler/lib/commonjs/Directions');

const NOOP = (): void => {
  // do nothing
};

const PanGestureHandler = _reactNative.View;
const attachGestureHandler = NOOP;
const createGestureHandler = NOOP;
const dropGestureHandler = NOOP;
const updateGestureHandler = NOOP;
const flushOperations = NOOP;
const NativeViewGestureHandler = _reactNative.View;
const TapGestureHandler = _reactNative.View;
const ForceTouchGestureHandler = _reactNative.View;
const LongPressGestureHandler = _reactNative.View;
const PinchGestureHandler = _reactNative.View;
const RotationGestureHandler = _reactNative.View;
const FlingGestureHandler = _reactNative.View;
const RawButton = _reactNative.TouchableNativeFeedback;
const BaseButton = _reactNative.TouchableNativeFeedback;
const RectButton = _reactNative.TouchableNativeFeedback;
const BorderlessButton = _reactNative.TouchableNativeFeedback;
var _default = {
  TouchableHighlight: _reactNative.TouchableHighlight,
  TouchableNativeFeedback: _reactNative.TouchableNativeFeedback,
  TouchableOpacity: _reactNative.TouchableOpacity,
  TouchableWithoutFeedback: _reactNative.TouchableWithoutFeedback,
  ScrollView: _reactNative.ScrollView,
  FlatList: _reactNative.FlatList,
  Switch: _reactNative.Switch,
  TextInput: _reactNative.TextInput,
  DrawerLayoutAndroid: _reactNative.DrawerLayoutAndroid,
  NativeViewGestureHandler,
  TapGestureHandler,
  ForceTouchGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  RawButton,
  BaseButton,
  RectButton,
  BorderlessButton,
  PanGestureHandler,
  attachGestureHandler,
  createGestureHandler,
  dropGestureHandler,
  updateGestureHandler,
  flushOperations,
  // probably can be removed
  Directions: _Directions.Directions,
  State: _State.State,
};
exports.default = _default;
//# sourceMappingURL=mocks.js.map
