import Animated, { withTiming } from 'react-native-reanimated';
import {
  MINIMUM_HIDE_OFFSET,
  HIDE_CONTENT_OUTPUT_RANGE,
  DEFAULT_TIMING_HIDE_CONTENT_CONFIG,
} from '../constants/animations';

interface Props {
  result: number;
  hideContentOffset: number;
  hideFooterOffset: number;
  hideContentInterpolation: Animated.SharedValue<number>;
  hideFooterInterpolation: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isHideContentOnCardCollapseEnabled: boolean;
  isHideFooterOnCardCollapseEnabled: boolean;
}

export const onSnapHideContentOrFooterReaction = ({
  result,
  snapPointBottom,
  hideContentInterpolation,
  hideFooterInterpolation,
  hideContentOffset,
  hideFooterOffset,
  isHideContentOnCardCollapseEnabled,
  isHideFooterOnCardCollapseEnabled,
}: Props): void => {
  'worklet';

  if (snapPointBottom.value > 0) {
    /* NOTE: Ensuring that the hide content or footer animation uses a fallback
    value when the user configuration is not matching the minimum offset requirement */
    const contentSecurityOffset =
      hideContentOffset >= MINIMUM_HIDE_OFFSET ? hideContentOffset : MINIMUM_HIDE_OFFSET;
    const footerSecurityOffset =
      hideFooterOffset >= MINIMUM_HIDE_OFFSET ? hideFooterOffset : MINIMUM_HIDE_OFFSET;

    if (isHideContentOnCardCollapseEnabled) {
      if (
        result >= snapPointBottom.value - contentSecurityOffset &&
        hideContentInterpolation.value === 0
      ) {
        hideContentInterpolation.value = withTiming(
          HIDE_CONTENT_OUTPUT_RANGE,
          DEFAULT_TIMING_HIDE_CONTENT_CONFIG,
        );
      }

      if (
        result <= snapPointBottom.value - contentSecurityOffset &&
        hideContentInterpolation.value === HIDE_CONTENT_OUTPUT_RANGE
      ) {
        hideContentInterpolation.value = withTiming(0, DEFAULT_TIMING_HIDE_CONTENT_CONFIG);
      }
    }

    if (isHideFooterOnCardCollapseEnabled) {
      if (
        result >= snapPointBottom.value - footerSecurityOffset &&
        hideFooterInterpolation.value === 0
      ) {
        hideFooterInterpolation.value = withTiming(
          HIDE_CONTENT_OUTPUT_RANGE,
          DEFAULT_TIMING_HIDE_CONTENT_CONFIG,
        );
      }

      if (
        result <= snapPointBottom.value - footerSecurityOffset &&
        hideFooterInterpolation.value === HIDE_CONTENT_OUTPUT_RANGE
      ) {
        hideFooterInterpolation.value = withTiming(0, DEFAULT_TIMING_HIDE_CONTENT_CONFIG);
      }
    }
  }
};
