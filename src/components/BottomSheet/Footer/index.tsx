import React, { useCallback, useContext } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, useAnimatedReaction } from 'react-native-reanimated';
import { onPanGestureHitFooterReaction } from '../../../worklets';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';

interface Props {
  children: React.ReactNode;
}

const Wrapper = Animated.createAnimatedComponent(styled.View``);

const Footer: React.FC<Props> = ({ children }) => {
  const { isKeyboardVisible } = useContext(KeyboardContext);
  const { cardHeight, headerHeight, footerHeight, translationY, footerTranslationY } =
    useContext(ReusablePropsContext);

  const animatedParentStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      position: 'absolute',
      bottom: -footerTranslationY.value,
      width: '100%',
      zIndex: 3,
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
        isKeyboardVisible,
        headerHeight,
        footerHeight,
      });
    },
    [translationY.value, cardHeight, headerHeight, footerHeight, isKeyboardVisible],
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
      {children}
    </Wrapper>
  );
};

export default Footer;
