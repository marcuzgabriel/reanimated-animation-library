import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { getGestures } from '../getGestures';

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  isInputFieldFocused: { value: false } as Animated.SharedValue<boolean>,
  isPanning: { value: false } as Animated.SharedValue<boolean>,
  isPanningDown: { value: false } as Animated.SharedValue<boolean>,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isScrollable: { value: false } as Animated.SharedValue<boolean>,
  prevDragY: { value: 0 } as Animated.SharedValue<number>,
  dragY: { value: 0 } as Animated.SharedValue<number>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  scrollOffset: { value: 0 } as Animated.SharedValue<number>,
  startY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  innerScrollY: { value: 0 } as Animated.SharedValue<number>,
};

const mockRunOnJSDismissKeyboard = jest.fn();

jest.mock('react-native-gesture-handler');

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  runOnJS: (): typeof jest.fn => mockRunOnJSDismissKeyboard,
}));

describe('src/worklets/getGestures', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ensure that the startY.value is translationY.value', () => {
    renderHook(() => {
      PARAMS.startY = useSharedValue(0);
    });

    const { panGestureContent } = getGestures(PARAMS);

    expect(panGestureContent).toEqual({});
  });
});
