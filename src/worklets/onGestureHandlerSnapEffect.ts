import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SPRING_CONFIG } from '../constants/animations';
import { withFriction } from '../hoas/withFriction';

interface Props {
  translationY: Animated.SharedValue<number>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  snapEffectDirection: Animated.SharedValue<string>;
}

export const onGestureHandlerSnapEffect = ({
  translationY,
  prevDragY,
  dragY,
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
    snapEffectDirection.value = event.translationY > 0 ? 'down' : 'up';
    translationY.value = withFriction({
      value: dragY.value,
      initialVelocity: event.velocityY,
      friction: 0.1,
    });
  },
  onEnd: (): void => {
    'worklet';

    translationY.value = withSpring(0, DEFAULT_SPRING_CONFIG);
  },
});
