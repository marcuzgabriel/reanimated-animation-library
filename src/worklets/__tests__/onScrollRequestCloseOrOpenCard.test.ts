import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { onScrollRequestCloseOrOpenCard } from '../onScrollRequestCloseOrOpenCard';
import { DEFAULT_SPRING_CONFIG } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  result: 0 as number,
  autoScrollTriggerLength: 0 as number,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isScrollingDown: { value: false } as Animated.SharedValue<boolean>,
  isScrollingUp: { value: false } as Animated.SharedValue<boolean>,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  springConfig: DEFAULT_SPRING_CONFIG,
};

describe('src/worklets/onScrollRequestCloseOrOpenCard', () => {
  beforeEach(() => {
    renderHook(() => {
      PARAMS.translationY = useSharedValue(100);
    });
  });

  describe('should not open or close card', () => {
    it('should not update translationY.value when the user is not scrolling', () => {
      renderHook(() => {
        PARAMS.isScrollingDown = useSharedValue(false);
        PARAMS.isScrollingUp = useSharedValue(false);
      });

      onScrollRequestCloseOrOpenCard(PARAMS);

      expect(PARAMS.translationY.value).toBe(PARAMS.translationY.value);
    });
  });

  describe('should open or close card', () => {
    it(`should open card and update animation values when the user is scrolling
    up and card is collapsed`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.isCardCollapsed = useSharedValue(true);
          PARAMS.isScrollingUp = useSharedValue(true);
          PARAMS.isScrollingDown = useSharedValue(false);
          PARAMS.result = 50;
          PARAMS.autoScrollTriggerLength = 51;
        });

        onScrollRequestCloseOrOpenCard(PARAMS);

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(0);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
        expect(PARAMS.isScrollingDown.value).toBeFalsy();
        expect(PARAMS.isScrollingUp.value).toBeFalsy();
      });
    });

    it(`should close card and update animation values when the user is scrolling
    down and card is not collapsed`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.isCardCollapsed = useSharedValue(false);
          PARAMS.isScrollingDown = useSharedValue(true);
          PARAMS.snapPointBottom = useSharedValue(200);
          PARAMS.result = 50;
          PARAMS.autoScrollTriggerLength = 49;
        });

        onScrollRequestCloseOrOpenCard(PARAMS);

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(PARAMS.snapPointBottom.value);
        expect(PARAMS.translationY.value).toBe(200);
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
        expect(PARAMS.isScrollingDown.value).toBeFalsy();
        expect(PARAMS.isScrollingUp.value).toBeFalsy();
      });
    });
  });
});
