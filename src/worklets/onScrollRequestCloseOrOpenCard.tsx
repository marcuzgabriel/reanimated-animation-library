import Animated, { withSpring } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
} from '../constants/animations';

interface Props {
  result: number;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingDown: Animated.SharedValue<boolean>;
  isScrollingUp: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  snapPointBottom: Animated.SharedValue<number>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

export const onScrollRequestCloseOrOpenCard = ({
  isAnimationRunning,
  isScrollingDown,
  isScrollingUp,
  isCardCollapsed,
  snapPointBottom,
  result,
  translation,
}: Props): void => {
  'worklet';

  const shouldCardCollapse =
    isScrollingDown.value &&
    result >= DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM &&
    !isCardCollapsed.value;

  const shouldCardOpen =
    isScrollingUp.value &&
    result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM &&
    isCardCollapsed.value;

  if (shouldCardCollapse || shouldCardOpen) {
    isAnimationRunning.value = true;
    isCardCollapsed.value = shouldCardCollapse;
    translation.y.value = withSpring(
      shouldCardCollapse ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = false;
          isScrollingDown.value = false;
          isScrollingUp.value = false;
        }
      },
    );
  }
};
