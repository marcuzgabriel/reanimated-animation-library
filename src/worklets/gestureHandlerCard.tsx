import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_TIMING_CONFIG } from 'constants/animations';
import { Platform } from 'react-native';

interface Props {
  isPanning: Animated.SharedValue<boolean>;
  isPanningDown: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingEnabled: Animated.SharedValue<boolean>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  innerScrollY: Animated.SharedValue<number>;
  panGestureType: Animated.SharedValue<number>;
}

export const gestureHandlerCard = ({
  isPanning,
  isPanningDown,
  isCardCollapsed,
  isAnimationRunning,
  prevDragY,
  dragY,
  translationY,
  snapPointBottom,
  innerScrollY,
  panGestureType,
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';
    ctx.startY = translationY.value;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';
    isPanning.value = true;
    isPanningDown.value = ctx.startY + event.translationY > prevDragY.value ? true : false;
    prevDragY.value = dragY.value;
    dragY.value = ctx.startY + event.translationY;

    if (innerScrollY.value === 0 && panGestureType.value === 1) {
      translationY.value = isCardCollapsed.value && dragY.value <= 0 ? 0 : dragY.value;
    } else if (panGestureType.value === 0) {
      translationY.value = isCardCollapsed.value && dragY.value <= 0 ? 0 : dragY.value;
    }
  },
  onEnd: (): void => {
    'worklet';
    isCardCollapsed.value = isPanningDown.value;
    isAnimationRunning.value = true;
    isPanning.value = false;

    translationY.value = withSpring(
      isPanningDown.value ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      () => {
        isAnimationRunning.value = false;
      },
    );
  },
});
