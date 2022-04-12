import Animated, { useSharedValue } from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-hooks';
import { onGestureHandlerSnapEffect } from '../onGestureHandlerSnapEffect';
import { withFriction } from '../../hoas/withFriction';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const EVENT = { translationY: 0, velocityY: 0.1 };
const CTX = { startY: 0 };
const PARAMS = {
  translationY: { value: 0 } as Animated.SharedValue<number>,
  prevDragY: { value: 0 } as Animated.SharedValue<number>,
  dragY: { value: 0 } as Animated.SharedValue<number>,
  snapEffectDirection: { value: '' } as Animated.SharedValue<string>,
};

jest.mock('../../hoas/withFriction');

describe('src/worklets/onGestureHandlerSnapEffect', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onStart', () => {
    it('should ensure that the intial gesture value ctx.startY is translationY.value', () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(100);
      });

      const { onStart } = onGestureHandlerSnapEffect(PARAMS);

      onStart({}, CTX);

      expect(CTX.startY).toEqual(PARAMS.translationY.value);
      expect(CTX.startY).toBe(100);
    });
  });

  describe('onActive', () => {
    beforeEach(() => {
      (withFriction as jest.Mock).mockImplementation(() => 100);
    });

    it('should update prevDragY.value to latest translationY.value', () => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(100);
      });

      const { onActive } = onGestureHandlerSnapEffect(PARAMS);

      onActive(EVENT, CTX);

      expect(PARAMS.prevDragY.value).toEqual(PARAMS.translationY.value);
      expect(PARAMS.prevDragY.value).toBe(100);
    });

    it(`should update dragY.value so it represents the y gesture event thats derived from
    adding ctx.startY with event.translationY`, () => {
      EVENT.translationY = 100;
      CTX.startY = 100;

      const { onActive } = onGestureHandlerSnapEffect(PARAMS);

      onActive(EVENT, CTX);

      expect(PARAMS.dragY.value).toEqual(EVENT.translationY + CTX.startY);
      expect(PARAMS.dragY.value).toBe(200);
    });

    it('should execute withFriction function', () => {
      const { onActive } = onGestureHandlerSnapEffect(PARAMS);

      onActive(EVENT, CTX);

      expect(withFriction).toHaveBeenCalledTimes(1);
      expect(withFriction).toHaveBeenCalledWith({
        value: PARAMS.dragY.value,
        initialVelocity: EVENT.velocityY,
        friction: 0.1,
      });
    });

    describe('snapEffectDirection', () => {
      it('should update snapEffectDirection.value to down when event.translationY is higher than 0', () => {
        EVENT.translationY = 1;

        renderHook(() => {
          PARAMS.snapEffectDirection = useSharedValue('up');
        });

        const { onActive } = onGestureHandlerSnapEffect(PARAMS);

        onActive(EVENT, CTX);

        expect(PARAMS.snapEffectDirection.value).toBe('down');
      });

      it('should update snapEffectDirection.value to up when event.translationY is less or equal to 0', () => {
        EVENT.translationY = 0;

        renderHook(() => {
          PARAMS.snapEffectDirection = useSharedValue('down');
        });

        const { onActive } = onGestureHandlerSnapEffect(PARAMS);

        onActive(EVENT, CTX);

        expect(PARAMS.snapEffectDirection.value).toBe('up');
      });
    });
  });

  describe('onEnd', () => {
    it(`should ensure that the animation returns the card back to its original y position
    by updating translationY.value to 0`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.translationY = useSharedValue(100);
        });

        const { onEnd } = onGestureHandlerSnapEffect(PARAMS);

        onEnd();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(0);
      });
    });
  });
});
