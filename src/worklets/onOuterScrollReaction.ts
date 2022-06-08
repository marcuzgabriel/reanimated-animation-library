import Animated from 'react-native-reanimated';
import { onScrollRequestCloseOrOpenCard } from './onScrollRequestCloseOrOpenCard';
import { DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM } from '../constants/animations';
import type { BottomSheetConfiguration } from '../types';

interface OuterScrollEventProps {
  isEnabled?: boolean;
  scrollY?: Animated.SharedValue<number>;
  autoScrollTriggerLength?: number;
}

interface Props {
  result: number;
  previous?: number | null;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isScrollingUp: Animated.SharedValue<boolean>;
  isScrollingDown: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  springConfig: BottomSheetConfiguration['springConfig'];
  outerScrollEvent?: OuterScrollEventProps;
}

export const onOuterScrollReaction = ({
  result,
  previous,
  isCardCollapsed,
  isScrollingUp,
  isScrollingDown,
  isAnimationRunning,
  outerScrollEvent,
  translationY,
  snapPointBottom,
  springConfig,
}: Props): void => {
  'worklet';

  let isReadyForOnScrollRequestCloseOrOpenCardWorklet =
    outerScrollEvent?.scrollY?.value === 0 && isCardCollapsed.value;
  const autoScrollTriggerLength =
    outerScrollEvent?.autoScrollTriggerLength ?? DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM;

  if (typeof previous === 'number' && result !== previous) {
    isScrollingDown.value = result > previous;
    isScrollingUp.value = result < previous;

    if (result < autoScrollTriggerLength && isScrollingDown.value && !isCardCollapsed.value) {
      isReadyForOnScrollRequestCloseOrOpenCardWorklet = false;
      translationY.value = result;
    } else {
      isReadyForOnScrollRequestCloseOrOpenCardWorklet = true;
    }
  }

  if (isReadyForOnScrollRequestCloseOrOpenCardWorklet) {
    onScrollRequestCloseOrOpenCard({
      autoScrollTriggerLength,
      isAnimationRunning,
      isScrollingDown,
      isScrollingUp,
      isCardCollapsed,
      translationY,
      snapPointBottom,
      springConfig,
      result,
    });
  }
};
