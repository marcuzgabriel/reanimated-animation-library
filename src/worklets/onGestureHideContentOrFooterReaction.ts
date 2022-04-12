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

type OmitTypes =
  | 'hideContentOffset'
  | 'hideFooterOffset'
  | 'isHideContentOnCardCollapseEnabled'
  | 'isHideFooterOnCardCollapseEnabled';

type ShouldExecuteAnimationParams = Omit<Props, OmitTypes> & {
  contentOffset: number;
  footerOffset: number;
};

const shouldExecuteAnimation = ({
  ...args
}: ShouldExecuteAnimationParams): Record<string, boolean> => {
  'worklet';

  const {
    result,
    snapPointBottom,
    hideFooterInterpolation,
    hideContentInterpolation,
    contentOffset,
    footerOffset,
  } = args;

  const contentOffsetTrigger = snapPointBottom.value - contentOffset;
  const footerOffsetTrigger = snapPointBottom.value - footerOffset;
  const isContentVisible = hideContentInterpolation.value === 0;
  const isFooterVisible = hideFooterInterpolation.value === 0;
  const isContentHidden = hideContentInterpolation.value === HIDE_CONTENT_OUTPUT_RANGE;
  const isFooterHidden = hideFooterInterpolation.value === HIDE_CONTENT_OUTPUT_RANGE;

  return {
    executeContentAnimationDown: result >= contentOffsetTrigger && isContentVisible,
    executeContentAnimationUp: result <= contentOffsetTrigger && isContentHidden,
    executeFooterAnimationDown: result >= footerOffsetTrigger && isFooterVisible,
    executeFooterAnimationUp: result <= footerOffsetTrigger && isFooterHidden,
  };
};

export const onGestureHideContentOrFooterReaction = ({
  isHideContentOnCardCollapseEnabled,
  isHideFooterOnCardCollapseEnabled,
  ...rest
}: Props): void => {
  'worklet';

  const {
    snapPointBottom,
    hideContentOffset,
    hideFooterOffset,
    hideContentInterpolation,
    hideFooterInterpolation,
  } = rest;

  if (!snapPointBottom.value) {
    return;
  }

  const {
    executeContentAnimationDown,
    executeContentAnimationUp,
    executeFooterAnimationDown,
    executeFooterAnimationUp,
  } = shouldExecuteAnimation({
    ...rest,
    contentOffset: hideContentOffset ?? MINIMUM_HIDE_OFFSET,
    footerOffset: hideFooterOffset ?? MINIMUM_HIDE_OFFSET,
  });

  const executeContentAnimation = executeContentAnimationDown || executeContentAnimationUp;
  const executeFooterAnimation = executeFooterAnimationDown || executeFooterAnimationUp;

  if (isHideContentOnCardCollapseEnabled && executeContentAnimation) {
    hideContentInterpolation.value = withTiming(
      executeContentAnimationDown ? HIDE_CONTENT_OUTPUT_RANGE : 0,
      DEFAULT_TIMING_HIDE_CONTENT_CONFIG,
    );
  }

  if (isHideFooterOnCardCollapseEnabled && executeFooterAnimation) {
    hideFooterInterpolation.value = withTiming(
      executeFooterAnimationDown ? HIDE_CONTENT_OUTPUT_RANGE : 0,
      DEFAULT_TIMING_HIDE_CONTENT_CONFIG,
    );
  }
};
