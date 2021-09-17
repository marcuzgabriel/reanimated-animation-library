import Animated, { withTiming } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG, ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../constants/animations';

interface Props {
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  opacityInterpolationEndArrow: Animated.SharedValue<number>;
  opacityInterpolationTopArrow: Animated.SharedValue<number>;
  isScrolling: Animated.SharedValue<boolean>;
}

export const onScrollArrowAppearanceReaction = ({
  isScrolledToTop,
  isScrolledToEnd,
  isInputFieldFocused,
  opacityInterpolationEndArrow,
  opacityInterpolationTopArrow,
  isScrolling,
  isScrollable,
}: Props): void => {
  'worklet';

  if (isScrollable.value && !isInputFieldFocused.value) {
    const hideTopArrow = isScrolledToTop.value;
    const hideEndArrow = isScrolledToEnd.value;
    isScrolling.value = !hideTopArrow && !hideEndArrow;

    opacityInterpolationEndArrow.value = withTiming(
      hideEndArrow ? ARROW_DOWN_OFFSET : 0,
      DEFAULT_TIMING_CONFIG,
    );

    opacityInterpolationTopArrow.value = withTiming(
      hideTopArrow ? ARROW_UP_OFFSET : 0,
      DEFAULT_TIMING_CONFIG,
    );
  } else {
    opacityInterpolationEndArrow.value = ARROW_DOWN_OFFSET;
    opacityInterpolationTopArrow.value = ARROW_UP_OFFSET;
  }
};
