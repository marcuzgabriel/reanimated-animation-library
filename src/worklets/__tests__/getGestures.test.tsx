import React from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/src/jestUtils';
import { render, cleanup } from '@testing-library/react-native';
import Animated from 'react-native-reanimated';
import PanGestureTestComponent from '../../utils/PanGestureTestComponent';
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

const mockedEventHandlers = (): Record<string, typeof jest.fn> => {
  return {
    begin: jest.fn(),
    start: jest.fn(),
    active: jest.fn(),
    end: jest.fn(),
    fail: jest.fn(),
    cancel: jest.fn(),
    finish: jest.fn(),
  };
};

export interface EventHandlersProps {
  eventHandlers: ReturnType<typeof mockedEventHandlers>;
}

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  runOnJS: (): typeof jest.fn => mockRunOnJSDismissKeyboard,
}));

describe('src/worklets/getGestures', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ensure that the startY.value is translationY.value ..', () => {
    const { panGestureContent } = getGestures(PARAMS);
    const handlers = mockedEventHandlers();

    render(<PanGestureTestComponent eventHandlers={handlers} gesture={panGestureContent} />);

    /*
      https://github.com/software-mansion/react-native-gesture-handler/issues/2007
      https://github.com/software-mansion/react-native-gesture-handler/blob/main/src/__tests__/Events.test.tsx
    */

    fireGestureHandler<PanGestureHandler>(getByGestureTestId('pan'), [
      { state: State.BEGAN },
      { state: State.ACTIVE },
      { state: State.END },
    ]);
    expect(handlers.begin).toBeCalledWith(expect.objectContaining({ state: State.BEGAN }));
    expect(handlers.finish).toBeCalled();
  });
});
