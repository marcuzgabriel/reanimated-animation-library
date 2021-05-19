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
  cardHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  children: React.ReactNode;
}

const Wrapper = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 3;
`;

const Footer: React.FC<Props> = ({ translationY, cardHeight, headerHeight, children }) => {
  const footerTranslationY = useSharedValue(0);
  const footerHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
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
    <Wrapper onLayout={onLayout}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Wrapper>
  );
};

export default Footer;
