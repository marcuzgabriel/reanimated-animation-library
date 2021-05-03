import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_TIMING_CONFIG } from 'constants/animations';

interface Props {
  isPanning: Animated.SharedValue<boolean>;
  isPanningDown: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
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
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    ctx.startY = translationY.value;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    isPanning.value = true;
    isPanningDown.value = ctx.startY + event.translationY > prevDragY.value ? true : false;
    prevDragY.value = dragY.value;
    dragY.value = ctx.startY + event.translationY;
    translationY.value = isCardCollapsed.value && dragY.value <= 0 ? 0 : dragY.value;
  },
  onEnd: (): void => {
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
