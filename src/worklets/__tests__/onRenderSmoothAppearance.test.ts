import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { onRenderSmoothAppearance } from '../onRenderSmoothAppearance';
import { DEFAULT_SPRING_VALUE_OUTCOME } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  headerHeight: { value: 0 } as Animated.SharedValue<number>,
  contentHeight: { value: 0 } as Animated.SharedValue<number>,
  smoothAppearanceClock: { value: 0 } as Animated.SharedValue<number>,
  isSmoothAppearanceAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  shouldWaitForContent: false as boolean,
};

describe('src/worklets/onRenderSmoothAppearance', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shouldWaitForContent is true and isSmoothAppearanceAnimationRunning.value is false', () => {
    beforeEach(() => {
      PARAMS.shouldWaitForContent = true;
      PARAMS.isSmoothAppearanceAnimationRunning.value = false;
    });

    describe('headerHeight and contentHeight is higher than 0', () => {
      beforeEach(() => {
        renderHook(() => {
          PARAMS.isSmoothAppearanceAnimationRunning = useSharedValue(false);
          PARAMS.smoothAppearanceClock = useSharedValue(0);
          PARAMS.headerHeight = useSharedValue(100);
          PARAMS.contentHeight = useSharedValue(100);
        });
      });

      it('should execute animation and update smoothAppearanceClock.value to DEFAULT_SPRING_VALUE_OUTCOME', () => {
        withReanimatedTimer(() => {
          onRenderSmoothAppearance(PARAMS);

          expect(PARAMS.smoothAppearanceClock.value).toBe(0);
          expect(PARAMS.isSmoothAppearanceAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.isSmoothAppearanceAnimationRunning.value).toBeFalsy();
          expect(PARAMS.smoothAppearanceClock.value).toBe(DEFAULT_SPRING_VALUE_OUTCOME);
        });
      });
    });

    describe('headerHeight is higher than 0 and contentHeight is 0', () => {
      beforeEach(() => {
        renderHook(() => {
          PARAMS.isSmoothAppearanceAnimationRunning = useSharedValue(false);
          PARAMS.smoothAppearanceClock = useSharedValue(0);
          PARAMS.headerHeight = useSharedValue(100);
          PARAMS.contentHeight = useSharedValue(0);
        });
      });

      it('should not execute animation by ensuring that smoothAppearanceClock is not being updated', () => {
        withReanimatedTimer(() => {
          onRenderSmoothAppearance(PARAMS);

          expect(PARAMS.smoothAppearanceClock.value).toBe(0);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.smoothAppearanceClock.value).toBe(0);
        });
      });
    });
  });

  describe('shouldWaitForContent and isSmoothAppearanceAnimationRunning.value are both false', () => {
    beforeEach(() => {
      PARAMS.shouldWaitForContent = false;
      PARAMS.isSmoothAppearanceAnimationRunning.value = false;
    });

    describe('headerHeight is higher than 0', () => {
      beforeEach(() => {
        renderHook(() => {
          PARAMS.isSmoothAppearanceAnimationRunning = useSharedValue(false);
          PARAMS.smoothAppearanceClock = useSharedValue(0);
          PARAMS.headerHeight = useSharedValue(100);
        });
      });

      it('should execute animation and update smoothAppearanceClock.value to DEFAULT_SPRING_VALUE_OUTCOME', () => {
        withReanimatedTimer(() => {
          onRenderSmoothAppearance(PARAMS);

          expect(PARAMS.isSmoothAppearanceAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.isSmoothAppearanceAnimationRunning.value).toBeFalsy();
          expect(PARAMS.smoothAppearanceClock.value).toBe(DEFAULT_SPRING_VALUE_OUTCOME);
        });
      });

      it('should ensure that smoothAppearanceClock.value is being reset to 0 if it is higher than 0', () => {
        renderHook(() => {
          PARAMS.smoothAppearanceClock = useSharedValue(100);
        });

        onRenderSmoothAppearance(PARAMS);

        expect(PARAMS.smoothAppearanceClock.value).toBe(0);
      });
    });

    describe('headerHeight is 0', () => {
      beforeEach(() => {
        renderHook(() => {
          PARAMS.isSmoothAppearanceAnimationRunning = useSharedValue(false);
          PARAMS.smoothAppearanceClock = useSharedValue(0);
          PARAMS.headerHeight = useSharedValue(0);
        });
      });

      it('should not execute animation by ensuring that smoothAppearanceClock is not being updated', () => {
        withReanimatedTimer(() => {
          onRenderSmoothAppearance(PARAMS);

          expect(PARAMS.smoothAppearanceClock.value).toBe(0);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.smoothAppearanceClock.value).toBe(0);
        });
      });
    });
  });
});
