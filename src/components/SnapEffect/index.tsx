import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  withSpring,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { DEFAULT_TIMING_CONFIG, DRAG_RESISTANCE_FACTOR } from 'constants/animations';

interface Props {
  children: React.ReactNode;
  isSnapEffectActive: boolean;
  snapEffectDirection: Animated.SharedValue<string>;
}

interface AnimatedGHContext {
  [key: string]: number;
  startX: number;
  startY: number;
}

const SnapEffect: React.FC<Props> = ({ isSnapEffectActive, snapEffectDirection, children }) => {
  const translationY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragResistanceFactor = useSharedValue(0);

  const windowHeight = useWindowDimensions().height;
  const maxDragY = useMemo(() => windowHeight * DRAG_RESISTANCE_FACTOR, [windowHeight]);
  const minDragY = useMemo(() => -windowHeight * DRAG_RESISTANCE_FACTOR, [windowHeight]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      ctx.startY = translationY.value;
    },
    onActive: (event, ctx) => {
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
    onEnd: () => {
      translationY.value = withSpring(0, DEFAULT_TIMING_CONFIG);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateY: translationY.value }],
  }));

  return (
    <PanGestureHandler enabled={isSnapEffectActive} onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export default SnapEffect;
