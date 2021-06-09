import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_SPRING_CONFIG } from '../constants/animations';

interface Props {
  result: number;
  autoScrollTriggerLength: number;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingDown: Animated.SharedValue<boolean>;
  isScrollingUp: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
}

export const onScrollRequestCloseOrOpenCard = ({
  autoScrollTriggerLength,
  isAnimationRunning,
  isScrollingDown,
  isScrollingUp,
  isCardCollapsed,
  snapPointBottom,
  result,
  translationY,
}: Props): void => {
  'worklet';

  const shouldCardCollapse =
    isScrollingDown.value && result >= autoScrollTriggerLength && !isCardCollapsed.value;

  const shouldCardOpen =
    isScrollingUp.value && result < autoScrollTriggerLength && isCardCollapsed.value;

  if (shouldCardCollapse || shouldCardOpen) {
    isAnimationRunning.value = true;
    isCardCollapsed.value = shouldCardCollapse;
    translationY.value = withSpring(
      shouldCardCollapse ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_SPRING_CONFIG,
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
