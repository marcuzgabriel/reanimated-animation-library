import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP } from '../constants/animations';
import type { BottomSheetConfiguration } from '../types';

interface Props {
  result: number;
  autoScrollTriggerLength: number;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingDown: Animated.SharedValue<boolean>;
  isScrollingUp: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  springConfig: BottomSheetConfiguration['springConfig'];
}

export const onScrollRequestCloseOrOpenCard = ({
  autoScrollTriggerLength,
  isAnimationRunning,
  isScrollingDown,
  isScrollingUp,
  isCardCollapsed,
  snapPointBottom,
  springConfig,
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
      springConfig,
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
