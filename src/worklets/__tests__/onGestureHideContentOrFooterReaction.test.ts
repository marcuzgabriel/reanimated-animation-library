import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { onGestureHideContentOrFooterReaction } from '../onGestureHideContentOrFooterReaction';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  result: 0 as number,
  hideContentOffset: 0 as number,
  hideFooterOffset: 0 as number,
  hideContentInterpolation: { value: 0 } as Animated.SharedValue<number>,
  hideFooterInterpolation: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isHideContentOnCardCollapseEnabled: false as boolean,
  isHideFooterOnCardCollapseEnabled: false as boolean,
};

describe('src/worklets/onGestureHideContentOrFooterReaction', () => {
  describe('snapPointBottom.value is higher than 0', () => {
    describe('isHideContentOnCardCollapseEnabled.value is true', () => {
      beforeEach(() => {
        PARAMS.isHideContentOnCardCollapseEnabled = true;
      });

      it(`should hide content and execute the hiding animation, when translationY.value is higher
      or equal to snapPointBottom.value minus a default value of 5px or an offset value provided
      by the user`, () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(100);
            PARAMS.hideContentInterpolation = useSharedValue(0);
            PARAMS.result = 100;
            PARAMS.hideContentOffset = 10;
          });

          onGestureHideContentOrFooterReaction(PARAMS);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.hideContentInterpolation.value).toBe(HIDE_CONTENT_OUTPUT_RANGE);
          expect(PARAMS.hideContentInterpolation.value).toBe(10);
        });
      });

      it(`should make the content visible and execute the visible animation, when translationY.value
      is less or equal to snapPointBottom.value minus a a default value of 5px or an offset value provided
      by the user`, () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.hideContentInterpolation = useSharedValue(HIDE_CONTENT_OUTPUT_RANGE);
            PARAMS.result = 100;
          });

          onGestureHideContentOrFooterReaction(PARAMS);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.hideContentInterpolation.value).toBe(0);
        });
      });
    });

    describe('isHideContentOnCardCollapseEnabled.value is false', () => {
      beforeEach(() => {
        PARAMS.isHideContentOnCardCollapseEnabled = false;
      });

      it('should not update hideContentInterpolation.value', () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.hideContentInterpolation = useSharedValue(HIDE_CONTENT_OUTPUT_RANGE);
          });

          onGestureHideContentOrFooterReaction(PARAMS);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.hideContentInterpolation.value).toBe(HIDE_CONTENT_OUTPUT_RANGE);
        });
      });
    });

    describe('isHideFooterOnCardCollapseEnabled.value is true', () => {
      beforeEach(() => {
        PARAMS.isHideFooterOnCardCollapseEnabled = true;
      });

      it(`should hide footer and execute the hiding animation, when translationY.value is higher
      or equal to snapPointBottom.value minus a default value of 5px or an offset value provided
      by the user`, () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(100);
            PARAMS.hideFooterInterpolation = useSharedValue(0);
            PARAMS.result = 100;
            PARAMS.hideFooterOffset = 10;
          });

          onGestureHideContentOrFooterReaction(PARAMS);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.hideFooterInterpolation.value).toBe(HIDE_CONTENT_OUTPUT_RANGE);
          expect(PARAMS.hideFooterInterpolation.value).toBe(10);
        });
      });

      it(`should make the footer visible and execute the visible animation, when translationY.value
      is less or equal to snapPointBottom.value minus a default value of 5px or an offset value provided
      by the user`, () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.snapPointBottom = useSharedValue(200);
            PARAMS.hideFooterInterpolation = useSharedValue(HIDE_CONTENT_OUTPUT_RANGE);
            PARAMS.result = 100;
          });

          onGestureHideContentOrFooterReaction(PARAMS);

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.hideFooterInterpolation.value).toBe(0);
        });
      });
    });
  });

  describe('snapPointBottom.value is 0', () => {
    it('should not execute animation', () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.snapPointBottom = useSharedValue(0);
          PARAMS.hideContentInterpolation = useSharedValue(0);
          PARAMS.hideFooterInterpolation = useSharedValue(0);
        });

        onGestureHideContentOrFooterReaction(PARAMS);

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.hideContentInterpolation.value).toBe(0);
        expect(PARAMS.hideFooterInterpolation.value).toBe(0);
      });
    });
  });
});
