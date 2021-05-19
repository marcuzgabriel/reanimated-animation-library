import { Platform } from 'react-native';
import Animated, { withSpring, runOnJS } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_SPRING_CONFIG,
  OFFSET_START_SNAP_TO_BOTTOM,
} from 'constants/animations';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';

interface Props {
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isPanning: Animated.SharedValue<boolean>;
  isPanningDown: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingCard: Animated.SharedValue<boolean>;
  isWeb: Animated.SharedValue<boolean>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  innerScrollY: Animated.SharedValue<number>;
  panGestureType: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
}

export const onGestureHandlerCard = ({
  isInputFieldFocused,
  isPanning,
  isPanningDown,
  isCardCollapsed,
  isAnimationRunning,
  isScrollingCard,
  isWeb,
  prevDragY,
  dragY,
  translationY,
  snapPointBottom,
  innerScrollY,
  panGestureType,
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    ctx.startY = translationY.value - innerScrollY.value;
    isPanningDown.value = false;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    isPanning.value = true;
    prevDragY.value = translationY.value;
    dragY.value = ctx.startY + event.translationY;

    if (dragY.value > 0) {
      if (
        isScrollingCard.value &&
        ctx.startY + event.translationY > prevDragY.value &&
        panGestureType.value === 1
      ) {
        if (innerScrollY.value === 0 || innerScrollY.value <= SCROLL_EVENT_THROTTLE) {
          translationY.value = dragY.value;
        }
      } else {
        translationY.value = dragY.value;
      }
    }
  },
  onEnd: (): void => {
    'worklet';

    isPanningDown.value = translationY.value > prevDragY.value;
    isCardCollapsed.value = isPanningDown.value;
    isAnimationRunning.value = true;
    isPanning.value = false;

    const isCardCollapsableWeb = isPanningDown.value
      ? isPanningDown.value && translationY.value >= OFFSET_START_SNAP_TO_BOTTOM
      : isPanningDown.value;

    const isCardCollapsableDefault =
      panGestureType.value === 1
        ? isPanningDown.value && translationY.value >= OFFSET_START_SNAP_TO_BOTTOM
        : isPanningDown.value;

    const isCardCollapsable = isWeb.value ? isCardCollapsableWeb : isCardCollapsableDefault;

    if (!isInputFieldFocused.value) {
      translationY.value = withSpring(
        isCardCollapsable ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_SPRING_CONFIG,
        () => {
          isAnimationRunning.value = false;
        },
      );
    }
  },
});
