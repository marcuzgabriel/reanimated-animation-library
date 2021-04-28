import Animated, { withSpring } from 'react-native-reanimated';
import {
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
    isScrollingDown.value === 1 && result >= DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ? 1 : 0;
  const shouldCardOpen =
    isScrollingUp.value === 1 && result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ? 1 : 0;

  if (shouldCardCollapse || shouldCardOpen) {
    isAnimationRunning.value === 1;
    isCardCollapsed.value = shouldCardCollapse ? 1 : 0;
    translation.y.value = withSpring(
      shouldCardCollapse ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = 0;
          isScrollingDown.value = 0;
          isScrollingUp.value = 0;
        }
      },
    );
  }
};
