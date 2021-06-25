import Animated, { withTiming } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG, ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../constants/animations';
import type { OnScrollArrowAppearanceReaction } from '../types';

const MINIMUM_SCROLLING_LENGTH = 16;

interface Props {
  result: OnScrollArrowAppearanceReaction;
  contentHeight: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  opacityInterpolationUpArrow: Animated.SharedValue<number>;
  opacityInterpolationDownArrow: Animated.SharedValue<number>;
  scrollingLength: Animated.SharedValue<number>;
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isUpArrowTouchable: Animated.SharedValue<boolean>;
  isDownArrowTouchable: Animated.SharedValue<boolean>;
}

export const onScrollArrowAppearanceReaction = ({
  result,
  contentHeight,
  scrollViewHeight,
  opacityInterpolationUpArrow,
  opacityInterpolationDownArrow,
  scrollingLength,
  isScrolledToTop,
  isScrolledToEnd,
  isScrollable,
  isInputFieldFocused,
  isDownArrowTouchable,
  isUpArrowTouchable,
}: Props): void => {
  'worklet';

  scrollingLength.value = contentHeight.value - scrollViewHeight.value;
  const isResultScrollable = contentHeight?.value > scrollViewHeight?.value;
  const isMinimumScrollingLengthReached = scrollingLength.value >= MINIMUM_SCROLLING_LENGTH;

  if (isResultScrollable && isMinimumScrollingLengthReached) {
    isScrollable.value = true;
    isScrolledToTop.value = result.scrollY.value === 0;
    isScrolledToEnd.value = Math.floor(result.scrollY.value) === Math.floor(scrollingLength.value);

    const hideUpArrow = isScrolledToTop.value || isInputFieldFocused.value;
    const hideDownArrow = isScrolledToEnd.value || isInputFieldFocused.value;

    opacityInterpolationUpArrow.value = withTiming(
      hideUpArrow ? ARROW_UP_OFFSET : 0,
      DEFAULT_TIMING_CONFIG,
    );

    opacityInterpolationDownArrow.value = withTiming(
      hideDownArrow ? ARROW_DOWN_OFFSET : 0,
      DEFAULT_TIMING_CONFIG,
    );
  } else if (isScrollable.value) {
    isScrollable.value = false;
    opacityInterpolationUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    opacityInterpolationDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
  }
};
