import Animated, { useSharedValue } from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-hooks';
import { onGestureHandlerCard } from '../onGestureHandlerCard';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const EVENT = { translationY: 0 };
const CTX = { startY: 0 };
const PARAMS = {
  isInputFieldFocused: { value: false } as Animated.SharedValue<boolean>,
  isPanning: { value: false } as Animated.SharedValue<boolean>,
  isPanningDown: { value: false } as Animated.SharedValue<boolean>,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isScrollingCard: { value: false } as Animated.SharedValue<boolean>,
  prevDragY: { value: 0 } as Animated.SharedValue<number>,
  dragY: { value: 0 } as Animated.SharedValue<number>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  innerScrollY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  type: '' as string,
};

const mockRunOnJSDismissKeyboard = jest.fn();

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  runOnJS: (): typeof jest.fn => mockRunOnJSDismissKeyboard,
}));

describe('src/worklets/onActionRequestCloseOrOpenCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onStart', () => {
    it(`should ensure that the initial ctx.startY value takes a transition event
    from scrolling to panning into account by being equal to translationY.value - innerScrollY.value,
    when type is content`, () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(100);
        PARAMS.innerScrollY = useSharedValue(50);
        PARAMS.isPanningDown = useSharedValue(false);
        PARAMS.type = 'content';
      });

      const { onStart } = onGestureHandlerCard(PARAMS);

      onStart({}, CTX);

      expect(PARAMS.type).toEqual('content');
      expect(CTX.startY).toEqual(50);
    });

    it('should ensure that ctx.startY equals translationY.value when type is header', () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(100);
        PARAMS.innerScrollY = useSharedValue(50);
        PARAMS.isPanningDown = useSharedValue(false);
        PARAMS.type = 'header';
      });

      const { onStart } = onGestureHandlerCard(PARAMS);

      onStart({}, CTX);

      expect(PARAMS.type).toEqual('header');
      expect(CTX.startY).toEqual(100);
    });
  });

  describe('onActive', () => {
    describe('Input field is not focused: Update relevant gesture handler values', () => {
      PARAMS.isInputFieldFocused.value = false;

      it('should update prevDragY.value so it is equal to latest translationY.value', () => {
        renderHook(() => {
          PARAMS.translationY = useSharedValue(100);
          PARAMS.prevDragY = useSharedValue(0);
        });

        const { onActive } = onGestureHandlerCard(PARAMS);

        onActive(EVENT, CTX);

        expect(PARAMS.prevDragY.value).toEqual(100);
      });

      it('should update dragY.value so it represents the y gesture handling which equals ctx.startY + event.translationY', () => {
        CTX.startY = 100;
        EVENT.translationY = 100;

        renderHook(() => {
          PARAMS.dragY = useSharedValue(0);
        });

        const { onActive } = onGestureHandlerCard(PARAMS);

        onActive(EVENT, CTX);

        expect(PARAMS.dragY.value).toEqual(200);
      });

      describe('User is dragging within limitations: dragY.value is higher than 0', () => {
        describe('User is scrolling: smooth transition from scrolling to panning', () => {
          it('should update translationY.value to dragY.value if the innerScrollY.value is 0', () => {
            renderHook(() => {
              PARAMS.isScrollingCard = useSharedValue(true);
              PARAMS.translationY = useSharedValue(0);
              PARAMS.prevDragY = useSharedValue(0);
              PARAMS.innerScrollY = useSharedValue(0);
              PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
              PARAMS.type = 'content';
            });

            const { onActive } = onGestureHandlerCard(PARAMS);

            onActive(EVENT, CTX);

            expect(PARAMS.translationY.value).toEqual(PARAMS.dragY.value);
            expect(PARAMS.translationY.value).toEqual(200);
          });

          it(`should update translationY.value to dragY.value if the innerScrollY.value is less or equal to the
          scroll event throttle of 16`, () => {
            renderHook(() => {
              PARAMS.translationY = useSharedValue(0);
              PARAMS.isScrollingCard = useSharedValue(true);
              PARAMS.prevDragY = useSharedValue(0);
              PARAMS.innerScrollY = useSharedValue(16);
              PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
              PARAMS.type = 'content';
            });

            const { onActive } = onGestureHandlerCard(PARAMS);

            onActive(EVENT, CTX);

            expect(PARAMS.translationY.value).toEqual(PARAMS.dragY.value);
            expect(PARAMS.translationY.value).toEqual(200);
          });

          it(`should not update translationY.value to dragY.value if the innerScrollY.value is higher than the
          scroll event throttle of 16`, () => {
            renderHook(() => {
              PARAMS.translationY = useSharedValue(0);
              PARAMS.isScrollingCard = useSharedValue(true);
              PARAMS.prevDragY = useSharedValue(0);
              PARAMS.innerScrollY = useSharedValue(17);
              PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
              PARAMS.type = 'content';
            });

            const { onActive } = onGestureHandlerCard(PARAMS);

            onActive(EVENT, CTX);

            expect(PARAMS.translationY.value).not.toEqual(PARAMS.dragY.value);
            expect(PARAMS.translationY.value).toEqual(0);
          });
        });

        describe('User is not scrolling', () => {
          it('should update translationY.value to dragY.value', () => {
            renderHook(() => {
              PARAMS.isScrollingCard = useSharedValue(false);
              PARAMS.translationY = useSharedValue(0);
              PARAMS.innerScrollY = useSharedValue(0);
              PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
              PARAMS.type = 'content';
            });

            const { onActive } = onGestureHandlerCard(PARAMS);

            onActive(EVENT, CTX);

            expect(PARAMS.translationY.value).toEqual(PARAMS.dragY.value);
            expect(PARAMS.translationY.value).toEqual(200);
          });
        });
      });

      describe('User is dragging outside limitations dragY.value is less or equal to 0', () => {
        it('should not update translationY.value to dragY.value', () => {
          CTX.startY = 0;
          EVENT.translationY = 0;

          renderHook(() => {
            PARAMS.isInputFieldFocused = useSharedValue(false);
            PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
            PARAMS.translationY = useSharedValue(0);
          });

          const { onActive } = onGestureHandlerCard(PARAMS);

          onActive(EVENT, CTX);

          expect(PARAMS.translationY.value).not.toEqual(-20);
          expect(PARAMS.translationY.value).toEqual(0);
        });
      });
    });

    describe('Input field is focused: Do not update relevant gesture handler values', () => {
      it('should not update translationY.value to dragY.value', () => {
        CTX.startY = 0;
        EVENT.translationY = -20;

        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(true);
          PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
          PARAMS.translationY = useSharedValue(0);
        });

        const { onActive } = onGestureHandlerCard(PARAMS);

        onActive(EVENT, CTX);

        expect(PARAMS.translationY.value).not.toEqual(PARAMS.dragY.value);
        expect(PARAMS.translationY.value).toEqual(0);
      });
    });
  });

  describe('onEnd', () => {
    it(`should update isPanning.value and isCardCollapsed.value to true when the user is dragging
    down which is derived from when prevDragY.value is less than dragY.value`, () => {
      CTX.startY = 50;
      EVENT.translationY = 50;

      renderHook(() => {
        PARAMS.isPanningDown = useSharedValue(false);
        PARAMS.isCardCollapsed = useSharedValue(false);
        PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
        PARAMS.translationY = useSharedValue(200);
      });

      const { onEnd } = onGestureHandlerCard(PARAMS);

      onEnd(EVENT);

      expect(PARAMS.isPanningDown.value).toBeTruthy();
      expect(PARAMS.isCardCollapsed.value).toBeTruthy();
    });

    it(`should update isPanning.value and isCardCollapsed.value to false when the user is dragging
    up which is derived from when prevDragY.value is higher than dragY.value`, () => {
      renderHook(() => {
        PARAMS.isPanningDown = useSharedValue(true);
        PARAMS.isCardCollapsed = useSharedValue(true);
        PARAMS.dragY = useSharedValue(CTX.startY + EVENT.translationY);
        PARAMS.prevDragY = useSharedValue(CTX.startY + EVENT.translationY + 1);
        PARAMS.translationY = useSharedValue(0);
      });

      const { onEnd } = onGestureHandlerCard(PARAMS);

      onEnd(EVENT);

      expect(PARAMS.isPanningDown.value).toBeFalsy();
      expect(PARAMS.isCardCollapsed.value).toBeFalsy();
    });

    it('should set isAnimationRunning.value to true and isPanning.value to false', () => {
      renderHook(() => {
        PARAMS.isPanning = useSharedValue(true);
        PARAMS.isAnimationRunning = useSharedValue(false);
      });

      const { onEnd } = onGestureHandlerCard(PARAMS);

      onEnd(EVENT);

      expect(PARAMS.isPanning.value).toBeFalsy();
      expect(PARAMS.isAnimationRunning.value).toBeTruthy();
    });

    describe('Input field is focused', () => {
      it('should dismiss keyboard if isInputFieldFocused.value is true and innerScrollY.value is 0', () => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(true);
          PARAMS.innerScrollY = useSharedValue(0);
        });

        const { onEnd } = onGestureHandlerCard(PARAMS);

        onEnd(EVENT);

        expect(mockRunOnJSDismissKeyboard).toHaveBeenCalledTimes(1);
      });
    });

    describe('Input field is not focused', () => {
      it('should open card if user is not panning down so that the translationY.value updates to 0', () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.isInputFieldFocused = useSharedValue(false);
            PARAMS.prevDragY = useSharedValue(200);
            PARAMS.translationY = useSharedValue(100);
          });

          const { onEnd } = onGestureHandlerCard(PARAMS);

          onEnd(EVENT);

          expect(PARAMS.isAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.isAnimationRunning.value).toBeFalsy();
          expect(PARAMS.translationY.value).not.toEqual(PARAMS.snapPointBottom.value);
          expect(PARAMS.translationY.value).toBe(0);
        });
      });

      it('should close card if user is panning down so that the translationY.value updates to snapPointBottom.value', () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.isInputFieldFocused = useSharedValue(false);
            PARAMS.prevDragY = useSharedValue(100);
            PARAMS.translationY = useSharedValue(200);
          });

          const { onEnd } = onGestureHandlerCard(PARAMS);

          onEnd(EVENT);

          expect(PARAMS.isAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.translationY.value).toEqual(PARAMS.snapPointBottom.value);
          expect(PARAMS.translationY.value).toBe(200);
        });
      });

      it('should not execute dismiss keyboard function when keyboard is not visible', () => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(false);
        });

        const { onEnd } = onGestureHandlerCard(PARAMS);

        onEnd(EVENT);

        expect(mockRunOnJSDismissKeyboard).not.toHaveBeenCalled();
      });
    });
  });
});
