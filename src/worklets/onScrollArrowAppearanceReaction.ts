import Animated, { withTiming } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG, ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../constants/animations';

const SCROLL_TO_TOP_EXTRA_TRIGGER_AREA = 20;

interface Props {
  result: Record<string, number | any>;
  cardContentHeight: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  translationYUpArrow: Animated.SharedValue<number>;
  translationYDownArrow: Animated.SharedValue<number>;
  scrollingLength: Animated.SharedValue<number>;
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
}

export const onScrollArrowAppearanceReaction = ({
  result,
  cardContentHeight,
  scrollViewHeight,
  translationYUpArrow,
  translationYDownArrow,
  scrollingLength,
  isScrolledToTop,
  isScrolledToEnd,
  isScrollable,
}: Props): void => {
  'worklet';

  if (result.isScrollable) {
    isScrollable.value = true;
    scrollingLength.value = cardContentHeight.value - scrollViewHeight.value;
    isScrolledToTop.value = result.innerScrollY <= SCROLL_TO_TOP_EXTRA_TRIGGER_AREA;
    isScrolledToEnd.value = Math.floor(result.innerScrollY) === Math.floor(scrollingLength.value);

    if (isScrolledToTop.value && translationYUpArrow.value !== ARROW_UP_OFFSET) {
      translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    }

    if (isScrolledToEnd.value && translationYDownArrow.value !== ARROW_DOWN_OFFSET) {
      translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
    }

    if (isScrolledToTop.value && translationYDownArrow.value !== 0) {
      translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }

    if (translationYDownArrow.value !== 0 && !isScrolledToEnd.value) {
      translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }

    if (translationYUpArrow.value !== 0 && !isScrolledToTop.value) {
      translationYUpArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }
  } else {
    isScrollable.value = false;
    translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
  }
};
