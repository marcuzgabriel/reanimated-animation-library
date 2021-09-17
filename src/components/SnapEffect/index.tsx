import React, { useState, useCallback } from 'react';
import { useWindowDimensions, LayoutChangeEvent } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedReaction,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { onGestureHandlerSnapEffect, onSnappableReaction } from '../../worklets';

interface Props {
  children: React.ReactNode;
  cardHeight: Animated.SharedValue<number>;
  snapEffectDirection: Animated.SharedValue<string>;
  isScrollableOffset?: number;
  isStaticOffset?: number;
}

interface AnimatedGHContext {
  [key: string]: number;
  startX: number;
  startY: number;
}

const View = styled.View``;

const SnapEffect: React.FC<Props> = ({
  cardHeight,
  isScrollableOffset,
  isStaticOffset,
  snapEffectDirection,
  children,
}) => {
  const [isSnapEffectActiveState, setIsSnapEffectActiveState] = useState<boolean>(false);

  const translationY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const windowHeight = useWindowDimensions().height;

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerSnapEffect({
      translationY,
      prevDragY,
      dragY,
      snapEffectDirection,
    }),
  );

  useAnimatedReaction(
    () => ({
      cardHeight,
      contentHeight,
    }),
    (
      result: Record<string, Animated.SharedValue<number>>,
      previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) => {
      if (result.contentHeight.value > 0 && result.cardHeight.value > 0) {
        const extraIsStaticOffset = isStaticOffset ?? 0;
        const extraIsScrollableOffset = isScrollableOffset ?? 0;
        const availableAreaBeforeOverlap =
          windowHeight - result.cardHeight.value - extraIsStaticOffset;
        const isCardOverlappingContent = result.contentHeight.value > availableAreaBeforeOverlap;

        return onSnappableReaction({
          result,
          previous,
          windowHeight,
          contentHeight,
          isSnapEffectActiveState,
          isCardOverlappingContent,
          offsetAddition: extraIsScrollableOffset,
          setIsSnapEffectActiveState,
        });
      }
    },
    [cardHeight, contentHeight, isSnapEffectActiveState],
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
