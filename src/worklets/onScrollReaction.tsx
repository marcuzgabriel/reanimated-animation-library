import Animated from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM } from '../constants/animations';
import { onScrollRequestCloseOrOpenCard } from '../worklets/onScrollRequestCloseOrOpenCard';

interface Props {
  result: number | undefined;
  previous: number | null | undefined;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isScrollingUp: Animated.SharedValue<boolean>;
  isScrollingDown: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
}

export const onScrollReaction = ({
  result,
  previous,
  isCardCollapsed,
  isScrollingUp,
  isScrollingDown,
  isAnimationRunning,
  translationY,
  snapPointBottom,
}: Props): void => {
  'worklet';

  if (result && previous) {
    if (result !== previous) {
      isScrollingDown.value = result > previous;
      isScrollingUp.value = result < previous;
    }

    if (
      result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM &&
      isScrollingDown.value &&
      !isCardCollapsed.value
    ) {
      translationY.value = result;
    } else {
      onScrollRequestCloseOrOpenCard({
        isAnimationRunning,
        isScrollingDown,
        isScrollingUp,
        isCardCollapsed,
        result,
        translationY,
        snapPointBottom,
      });
    }
  }
};
