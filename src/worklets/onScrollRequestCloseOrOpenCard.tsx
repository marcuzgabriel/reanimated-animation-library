import Animated, { withSpring } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_BOTTOM,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
} from '../constants/animations';

interface Props {
  result: number;
  isAnimationRunning: Animated.SharedValue<number>;
  isScrollingDown: Animated.SharedValue<number>;
  isScrollingUp: Animated.SharedValue<number>;
  isCardCollapsed: Animated.SharedValue<number>;
  shouldCardCollapse: Animated.SharedValue<number>;
  shouldCardOpen: Animated.SharedValue<number>;
  translation: {
    bottomY: Animated.SharedValue<number>;
    y: Animated.SharedValue<number>;
  };
}

export const onScrollRequestCloseOrOpenCard = ({
  isAnimationRunning,
  isScrollingDown,
  isScrollingUp,
  isCardCollapsed,
  shouldCardOpen,
  shouldCardCollapse,
  result,
  translation,
}: Props): void => {
  'worklet';

  shouldCardCollapse.value =
    isScrollingDown.value === 1 && result >= DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ? 1 : 0;
  shouldCardOpen.value =
    isScrollingUp.value === 1 && result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ? 1 : 0;

  if (shouldCardCollapse.value === 1 || shouldCardOpen.value === 1) {
    isAnimationRunning.value === 1;
    isCardCollapsed.value = shouldCardCollapse.value === 1 ? 1 : 0;
    translation.y.value = withSpring(
      shouldCardCollapse.value === 1 ? DEFAULT_SNAP_POINT_BOTTOM : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = 0;
          isScrollingDown.value = 0;
          isScrollingUp.value = 0;
          shouldCardCollapse.value = 0;
          shouldCardOpen.value = 0;
        }
      },
    );
  }
};
