import Animated, { withTiming } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG, ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from 'constants/animations';

const SCROLL_TO_TOP_EXTRA_TRIGGER_AREA = 20;

interface Props {
  result: Record<string, number | any>;
  cardContentHeight: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  translationYUpArrow: Animated.SharedValue<number>;
  translationYDownArrow: Animated.SharedValue<number>;
}

export const onScrollArrowAppearanceReaction = ({
  result,
  cardContentHeight,
  scrollViewHeight,
  translationYUpArrow,
  translationYDownArrow,
}: Props): void => {
  'worklet';

  if (result.isScrollable) {
    const scrollingLength = cardContentHeight.value - scrollViewHeight.value;
    const isScrolledToTop = result.innerScrollY <= SCROLL_TO_TOP_EXTRA_TRIGGER_AREA;
    const isScrolledToEnd = Math.floor(result.innerScrollY) === Math.floor(scrollingLength);

    if (isScrolledToTop && translationYUpArrow.value !== ARROW_UP_OFFSET) {
      translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    }

    if (isScrolledToEnd && translationYDownArrow.value !== ARROW_DOWN_OFFSET) {
      translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
    }

    if (isScrolledToTop && translationYDownArrow.value !== 0) {
      translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }

    if (translationYDownArrow.value !== 0 && !isScrolledToEnd) {
      translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }

    if (translationYUpArrow.value !== 0 && !isScrolledToTop) {
      translationYUpArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
    }
  } else {
    translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
  }
};
