import React, { useCallback } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { onPanGestureHitFooterReaction } from 'worklets';
import styled from 'styled-components/native';

interface Props {
  translationY: Animated.SharedValue<number>;
  footerTranslationY: Animated.SharedValue<number>;
  cardHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
  children: React.ReactNode;
}

const Wrapper = Animated.createAnimatedComponent(styled.View``);

const Footer: React.FC<Props> = ({
  translationY,
  footerTranslationY,
  cardHeight,
  headerHeight,
  footerHeight,
  children,
}) => {
  const animatedParentStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: footerTranslationY.value >= footerHeight.value ? -1 : 3,
    }),
  );

  const animatedChildStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      flex: 1,
      transform: [{ translateY: footerTranslationY.value }],
    }),
  );

  useAnimatedReaction(
    () => translationY.value,
    (result: number, previous: number | null | undefined) => {
      onPanGestureHitFooterReaction({
        result,
        previous,
        translationY,
        footerTranslationY,
        cardHeight,
        headerHeight,
        footerHeight,
      });
    },
    [translationY.value, cardHeight, headerHeight, footerHeight],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        footerHeight.value = e.nativeEvent.layout.height;
      }
    },
    [footerHeight],
  );

  return (
    <Wrapper onLayout={onLayout} style={animatedParentStyle}>
      <Animated.View style={animatedChildStyle}>{children}</Animated.View>
    </Wrapper>
  );
};

export default Footer;
