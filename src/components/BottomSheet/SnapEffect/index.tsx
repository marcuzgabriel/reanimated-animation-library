import React, { useState, useMemo, useCallback } from 'react';
import { useWindowDimensions, LayoutChangeEvent } from 'react-native';
import { useAnimatedReaction, useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { DRAG_RESISTANCE_FACTOR } from '../../../constants/animations';
import { onGestureHandlerSnapEffect, onSnappableReaction } from '../../../worklets';

interface Props {
  children: React.ReactNode;
  cardHeight: Animated.SharedValue<number>;
  snapEffectDirection: Animated.SharedValue<string>;
}

interface AnimatedGHContext {
  [key: string]: number;
  startX: number;
  startY: number;
}

const View = styled.View``;

const SnapEffect: React.FC<Props> = ({ cardHeight, snapEffectDirection, children }) => {
  const [isSnapEffectActiveState, setIsSnapEffectActiveState] = useState<boolean>(false);

  const translationY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragResistanceFactor = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const windowHeight = useWindowDimensions().height;
  const maxDragY = useMemo(() => windowHeight * DRAG_RESISTANCE_FACTOR, [windowHeight]);
  const minDragY = useMemo(() => -windowHeight * DRAG_RESISTANCE_FACTOR, [windowHeight]);

  const isCardOverlappingContent = useDerivedValue(() => {
    if (contentHeight.value > 0 && cardHeight.value > 0) {
      /* Aware: Window height is an easy way to determine this. 
      Furthermore, you might need a margin / padding threshold */
      const availableAreaBeforeOverlap = windowHeight - cardHeight.value;
      return contentHeight.value > availableAreaBeforeOverlap;
    }
  }, [contentHeight, cardHeight]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerSnapEffect({
      translationY,
      prevDragY,
      dragY,
      maxDragY,
      minDragY,
      dragResistanceFactor,
      snapEffectDirection,
    }),
  );

  useAnimatedReaction(
    () => isCardOverlappingContent.value,
    (result: boolean | undefined, previous: boolean | null | undefined) =>
      onSnappableReaction({
        result,
        previous,
        windowHeight,
        contentHeight,
        isSnapEffectActiveState,
        setIsSnapEffectActiveState,
      }),
    [isCardOverlappingContent],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateY: translationY.value }],
  }));

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        contentHeight.value = e.nativeEvent.layout.height;
      }
    },
    [contentHeight],
  );

  return (
    <View onLayout={onLayout}>
      <PanGestureHandler enabled={isSnapEffectActiveState} onGestureEvent={gestureHandler}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default SnapEffect;
