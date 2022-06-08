import Animated, { useSharedValue } from 'react-native-reanimated';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { onResetCardAndSlideToTopOrBottom } from '../onResetCardAndSlideToTopOrBottom';
import { scrollToPosition } from '../../helpers';
import { DEFAULT_SPRING_CONFIG } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  scrollY: { value: 0 } as Animated.SharedValue<number>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapEffectDirection: { value: '' } as Animated.SharedValue<string> | undefined,
  scrollViewRef: { current: {} } as React.RefObject<Animated.ScrollView>,
  slideDirection: '' as string,
  springConfig: DEFAULT_SPRING_CONFIG,
  snapPointBottom: 0 as number,
};

jest.mock('../../helpers/scrollToPosition');

describe('src/worklets/onResetCardAndSlideToTopOrBottom', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update isAnimationRunning.value to true', () => {
    renderHook(() => {
      PARAMS.isAnimationRunning = useSharedValue(false);
    });

    onResetCardAndSlideToTopOrBottom(PARAMS);

    expect(PARAMS.isAnimationRunning.value).toBeTruthy();
  });

  describe('reset snapEffectDirection', () => {
    it('should reset snapEffectDirection.value to an empty string when its defined', () => {
      renderHook(() => {
        PARAMS.snapEffectDirection = useSharedValue('down');
      });

      onResetCardAndSlideToTopOrBottom(PARAMS);

      expect(PARAMS.snapEffectDirection?.value).toBe('');
    });

    it('should not reset snapEffectDirection.value to an empty when its undefined', () => {
      renderHook(() => {
        PARAMS.snapEffectDirection = undefined;
      });

      onResetCardAndSlideToTopOrBottom(PARAMS);

      expect(PARAMS.snapEffectDirection?.value).toBeUndefined();
    });
  });

  describe('scrollToPosition', () => {
    it('should ensure that the card is scrolled to top when the user has scrolled', () => {
      renderHook(() => {
        PARAMS.scrollY = useSharedValue(1);
      });

      onResetCardAndSlideToTopOrBottom(PARAMS);

      expect(scrollToPosition).toHaveBeenCalledTimes(1);
      expect(scrollToPosition).toHaveBeenCalledWith({ ref: PARAMS.scrollViewRef, to: 'top' });
    });

    it('should not ensure that the card is scrolled top when the user has not scrolled', () => {
      renderHook(() => {
        PARAMS.scrollY = useSharedValue(0);
      });

      onResetCardAndSlideToTopOrBottom(PARAMS);

      expect(scrollToPosition).not.toHaveBeenCalledTimes(1);
      expect(scrollToPosition).not.toHaveBeenCalledWith({ ref: PARAMS.scrollViewRef, to: 'top' });
    });
  });

  describe('spring animation', () => {
    beforeEach(() => {
      renderHook(() => {
        PARAMS.translationY = useSharedValue(0);
      });
    });

    it('should update translationY.value to snapPointBottom when the slideDirection is bottom', () => {
      withReanimatedTimer(() => {
        PARAMS.slideDirection = 'bottom';
        PARAMS.snapPointBottom = 250;

        onResetCardAndSlideToTopOrBottom(PARAMS);

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
        expect(PARAMS.translationY.value).toEqual(PARAMS.snapPointBottom);
        expect(PARAMS.translationY.value).toBe(250);
      });
    });

    it('should update translationY.value to 0 when the slideDirection is top', () => {
      withReanimatedTimer(() => {
        PARAMS.slideDirection = 'top';

        onResetCardAndSlideToTopOrBottom(PARAMS);

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
        expect(PARAMS.translationY.value).not.toEqual(PARAMS.snapPointBottom);
        expect(PARAMS.translationY.value).toBe(0);
      });
    });
  });
});
