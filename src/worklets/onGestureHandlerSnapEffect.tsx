import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_TIMING_CONFIG } from 'constants/animations';

interface Props {
  translationY: Animated.SharedValue<number>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  maxDragY: number;
  minDragY: number;
  dragResistanceFactor: Animated.SharedValue<number>;
  snapEffectDirection: Animated.SharedValue<string>;
}

export const onGestureHandlerSnapEffect = ({
  translationY,
  prevDragY,
  dragY,
  maxDragY,
  minDragY,
  dragResistanceFactor,
  snapEffectDirection,
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    ctx.startY = translationY.value;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    prevDragY.value = translationY.value;
    dragY.value = ctx.startY + event.translationY;
    if (dragY.value <= maxDragY && dragY.value >= minDragY) {
      dragResistanceFactor.value =
        translationY.value > 0
          ? (maxDragY - translationY.value) / maxDragY
          : (minDragY - translationY.value) / minDragY;

      snapEffectDirection.value = event.translationY > 0 ? 'down' : 'up';
      translationY.value = dragY.value * dragResistanceFactor.value;
    }
  },
  onEnd: (): void => {
    'worklet';

    translationY.value = withSpring(0, DEFAULT_TIMING_CONFIG);
  },
});
