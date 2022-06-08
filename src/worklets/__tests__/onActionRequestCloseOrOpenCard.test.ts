import Animated, { useSharedValue } from 'react-native-reanimated';
import { onActionRequestCloseOrOpenCard } from '../onActionRequestCloseOrOpenCard';
import { renderHook } from '@testing-library/react-hooks';
import { DEFAULT_SPRING_CONFIG } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  springConfig: DEFAULT_SPRING_CONFIG,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
};

describe('src/worklets/onActionRequestCloseOrOpenCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('direction is set to either up or down', () => {
    it('should open the card when direction is down so that translationY.value goes from 100 to 0', () => {
      withReanimatedTimer(() => {
        const direction = 'down';

        renderHook(() => {
          PARAMS.translationY = useSharedValue(100);
          PARAMS.isCardCollapsed = useSharedValue(false);
          PARAMS.isAnimationRunning = useSharedValue(false);
          PARAMS.snapPointBottom = useSharedValue(0);
        });

        onActionRequestCloseOrOpenCard({ ...PARAMS, direction });

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(0);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
      });
    });

    it(`should close the card when direction is up so that translationY.value goes
    from 0 to to snapPointBottom.value`, () => {
      withReanimatedTimer(() => {
        const direction = 'up';

        renderHook(() => {
          PARAMS.translationY = useSharedValue(0);
          PARAMS.isCardCollapsed = useSharedValue(false);
          PARAMS.isAnimationRunning = useSharedValue(false);
          PARAMS.snapPointBottom = useSharedValue(100);
        });

        onActionRequestCloseOrOpenCard({ ...PARAMS, direction });

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(100);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
      });
    });
  });

  describe('automatically detect animation', () => {
    it(`should automatically close the card when translationY.value is less
    or equal to an offset of 5 so that the translationY.value goes from 0 to snapPointBottom.value`, () => {
      withReanimatedTimer(() => {
        const direction = undefined;

        renderHook(() => {
          PARAMS.translationY = useSharedValue(0);
          PARAMS.isCardCollapsed = useSharedValue(false);
          PARAMS.isAnimationRunning = useSharedValue(false);
          PARAMS.snapPointBottom = useSharedValue(100);
        });

        onActionRequestCloseOrOpenCard({ ...PARAMS, direction });

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(100);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
      });
    });

    it(`should automatically open the card when translationY.value is higher
    or equal to an offset of 5 so that the translationY.value goes from 100 to 0`, () => {
      withReanimatedTimer(() => {
        const direction = undefined;

        renderHook(() => {
          PARAMS.translationY = useSharedValue(100);
          PARAMS.isCardCollapsed = useSharedValue(false);
          PARAMS.isAnimationRunning = useSharedValue(false);
          PARAMS.snapPointBottom = useSharedValue(0);
        });

        onActionRequestCloseOrOpenCard({ ...PARAMS, direction });

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(0);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
      });
    });
  });
});
