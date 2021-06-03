import Animated, { withTiming } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG, ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../constants/animations';
import type { OnScrollArrowAppearanceReaction } from '../types';

const SCROLL_TO_TOP_EXTRA_TRIGGER_AREA = 20;

interface Props {
  result: OnScrollArrowAppearanceReaction;
  contentHeight: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  translationYUpArrow: Animated.SharedValue<number>;
  translationYDownArrow: Animated.SharedValue<number>;
  scrollingLength: Animated.SharedValue<number>;
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isTopArrowTouchable: Animated.SharedValue<boolean>;
  isBottomArrowTouchable: Animated.SharedValue<boolean>;
}

export const onScrollArrowAppearanceReaction = ({
  result,
  contentHeight,
  scrollViewHeight,
  translationYUpArrow,
  translationYDownArrow,
  scrollingLength,
  isScrolledToTop,
  isScrolledToEnd,
  isScrollable,
  isInputFieldFocused,
  isTopArrowTouchable,
  isBottomArrowTouchable,
}: Props): void => {
  'worklet';

  const isResultScrollable = contentHeight?.value > scrollViewHeight?.value;

  if (isResultScrollable) {
    isScrollable.value = true;
    scrollingLength.value = contentHeight.value - scrollViewHeight.value;
    isScrolledToTop.value = result.scrollY.value <= SCROLL_TO_TOP_EXTRA_TRIGGER_AREA;
    isScrolledToEnd.value = Math.floor(result.scrollY.value) === Math.floor(scrollingLength.value);

    if (isInputFieldFocused.value) {
      translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
      translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
      isTopArrowTouchable.value = false;
      isBottomArrowTouchable.value = false;
    } else {
      if (isScrolledToTop.value) {
        translationYUpArrow.value = withTiming(
          ARROW_UP_OFFSET,
          DEFAULT_TIMING_CONFIG,
          isAnimationComplete => {
            if (isAnimationComplete) {
              isTopArrowTouchable.value = false;
            }
          },
        );
        translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG, isAnimationComplete => {
          if (isAnimationComplete) {
            isBottomArrowTouchable.value = true;
          }
        });
      }

      if (isScrolledToEnd.value) {
        translationYDownArrow.value = withTiming(
          ARROW_DOWN_OFFSET,
          DEFAULT_TIMING_CONFIG,
          isAnimationComplete => {
            if (isAnimationComplete) {
              isBottomArrowTouchable.value = false;
            }
          },
        );
      }

      if (!isScrolledToEnd.value && !isScrolledToTop.value) {
        translationYUpArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
        translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
        isTopArrowTouchable.value = true;
        isBottomArrowTouchable.value = true;
      }
    }
  } else {
    isScrollable.value = false;
    translationYUpArrow.value = withTiming(ARROW_UP_OFFSET, DEFAULT_TIMING_CONFIG);
    translationYDownArrow.value = withTiming(ARROW_DOWN_OFFSET, DEFAULT_TIMING_CONFIG);
    isTopArrowTouchable.value = false;
    isBottomArrowTouchable.value = false;
  }
};
