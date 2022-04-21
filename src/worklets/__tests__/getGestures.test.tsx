import React from 'react';
import { Platform } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { render, cleanup } from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import PanGestureTestComponent from '../../utils/PanGestureTestComponent';
import { getGestures } from '../getGestures';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

/* Test issues and solutions:
  https://github.com/software-mansion/react-native-gesture-handler/issues/2007
  https://github.com/software-mansion/react-native-gesture-handler/blob/main/src/__tests__/Events.test.tsx
  https://github.com/software-mansion/react-native-reanimated/issues/3087
*/

beforeEach(cleanup);

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const EVENT = {
  translationY: 20,
};
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

interface runGestureHandlerParams {
  isHeader: boolean;
}

const runGestureHandler = (param?: runGestureHandlerParams): void => {
  const { isHeader } = param ?? {};
  const { panGestureHeader, panGestureContent } = getGestures(PARAMS);

  render(<PanGestureTestComponent gesture={isHeader ? panGestureHeader : panGestureContent} />);

  fireGestureHandler<PanGestureHandler>(
    getByGestureTestId(isHeader ? 'panGestureHeader' : 'panGestureContent'),
    [
      { state: State.BEGAN },
      { state: State.ACTIVE },
      { translationY: EVENT.translationY },
      { state: State.END },
    ],
  );
};

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  runOnJS: (): typeof jest.fn => mockRunOnJSDismissKeyboard,
}));

describe('src/worklets/getGestures', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('onBegin', () => {
    it('should ensure that the startY.value is translationY.value', () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(20);
        PARAMS.startY = useSharedValue(0);
      });

      runGestureHandler();

      expect(PARAMS.startY.value).toBe(20);
    });
  });

  describe('onUpdate', () => {
    describe('input field is not focused', () => {
      beforeEach(() => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(false);
        });
      });

      it('should update prevDragY.value so it is translationY.value', () => {
        renderHook(() => {
          PARAMS.translationY = useSharedValue(100);
          PARAMS.prevDragY = useSharedValue(0);
        });

        runGestureHandler();

        expect(PARAMS.prevDragY.value).toBe(100);
        expect(PARAMS.dragY.value).toBe(PARAMS.startY.value + EVENT.translationY);
      });

      describe('pan gesture is content', () => {
        it(`should update translationY.value to PARAMS.dragY.value - PARAMS.scrollOffset.value
        when platform is iOS`, () => {
          Platform.OS = 'ios';

          renderHook(() => {
            PARAMS.isScrollable = useSharedValue(true);
            PARAMS.innerScrollY = useSharedValue(0);
            PARAMS.translationY = useSharedValue(0);
            PARAMS.scrollOffset = useSharedValue(100);
            PARAMS.dragY = useSharedValue(20);
          });

          runGestureHandler();

          expect(PARAMS.translationY.value).toBe(PARAMS.dragY.value - PARAMS.scrollOffset.value);
        });

        it(`should update translationY.value to PARAMS.drag.value - prevDragY.value - scrollOffset.value
        when platform is android`, () => {
          Platform.OS = 'android';

          renderHook(() => {
            PARAMS.isScrollable = useSharedValue(true);
            PARAMS.innerScrollY = useSharedValue(0);
            PARAMS.translationY = useSharedValue(0);
            PARAMS.scrollOffset = useSharedValue(100);
            PARAMS.dragY = useSharedValue(20);
          });

          runGestureHandler();

          expect(PARAMS.translationY.value).toBe(
            PARAMS.dragY.value - PARAMS.prevDragY.value - PARAMS.scrollOffset.value,
          );
        });
      });

      describe('pan gesture is header', () => {
        it('should update translationY.value to dragY.value', () => {
          renderHook(() => {
            PARAMS.dragY = useSharedValue(100);
            PARAMS.translationY = useSharedValue(0);
          });

          runGestureHandler({ isHeader: true });

          expect(PARAMS.translationY.value).toBe(PARAMS.dragY.value);
        });
      });
    });
  });

  describe('onEnd', () => {
    it(`should update isPanning.value and isCardCollapsed.value to true when the user is dragging
    down which is derived from when prevDragY.value is less than dragY.value`, () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(50);
      });

      runGestureHandler();

      expect(PARAMS.isPanningDown.value).toBeTruthy();
      expect(PARAMS.isCardCollapsed.value).toBeTruthy();
    });

    it(`should update isPanning.value and isCardCollapsed.value to false when the user is dragging
    up which is derived from when prevDragY.value is higher than dragY.value`, () => {
      EVENT.translationY = -1;

      renderHook(() => {
        PARAMS.translationY = useSharedValue(50);
      });

      runGestureHandler();

      expect(PARAMS.isPanningDown.value).toBeFalsy();
      expect(PARAMS.isCardCollapsed.value).toBeFalsy();
    });

    describe('Input field is focused', () => {
      it('should dismiss keyboard if isInputFieldFocused.value is true and innerScrollY.value is 0', () => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(true);
          PARAMS.innerScrollY = useSharedValue(0);
        });

        runGestureHandler();

        expect(mockRunOnJSDismissKeyboard).toHaveBeenCalledTimes(1);
      });
    });

    describe('Input field is not focused', () => {
      it('should open card if user is panning up so that the translationY.value updates to 0', () => {
        withReanimatedTimer(() => {
          EVENT.translationY = -1;

          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.isInputFieldFocused = useSharedValue(false);
            PARAMS.translationY = useSharedValue(50);
          });

          runGestureHandler();

          expect(PARAMS.isAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.translationY.value).not.toBe(PARAMS.snapPointBottom.value);
          expect(PARAMS.translationY.value).toBe(0);
        });
      });

      it('should close card if user is panning down so that the translationY.value updates to snapPointBottom.value', () => {
        withReanimatedTimer(() => {
          EVENT.translationY = 20;

          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.isInputFieldFocused = useSharedValue(false);
            PARAMS.translationY = useSharedValue(50);
          });

          runGestureHandler();

          expect(PARAMS.isAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.isAnimationRunning.value).toBeFalsy();
          expect(PARAMS.translationY.value).toEqual(PARAMS.snapPointBottom.value);
          expect(PARAMS.translationY.value).toBe(200);
        });
      });

      it('should not execute dismiss keyboard function when keyboard is not visible', () => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(false);
        });

        runGestureHandler();

        expect(mockRunOnJSDismissKeyboard).not.toHaveBeenCalled();
      });
    });
  });
});
