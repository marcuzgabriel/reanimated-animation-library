import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ScrollArrow from '../ScrollArrow';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import type { MixedScrollViewProps } from '../../../types';
interface Props extends MixedScrollViewProps {
  scrollViewRef: React.RefObject<Animated.ScrollView> | any;
}

const AnimatedWrapper = Animated.createAnimatedComponent(styled.View``);

const ScrollView: React.FC<Props> = props => {
  const { contentHeight, scrollArrows, scrollViewRef, children } = props;

  const scrollViewHeight = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollingLength = useSharedValue(0);
  const contentHeightWhenKeyboardIsVisible = useSharedValue(0);
  const isInputFieldFocused = useSharedValue(false);
  const isScrolledToTop = useSharedValue(false);
  const isScrolledToEnd = useSharedValue(false);
  const isScrollable = useSharedValue(false);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> =>
      contentHeightWhenKeyboardIsVisible?.value > 0
        ? {
            height: contentHeightWhenKeyboardIsVisible.value,
          }
        : {},
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        scrollViewHeight.value = e.nativeEvent.layout.height;
      }
    },
    [scrollViewHeight],
  );

  const scrollArrowProps = useMemo(
    () => ({
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollY,
      scrollViewHeight,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
    }),
    [
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollY,
      scrollViewHeight,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
    ],
  );

  return (
    <AnimatedWrapper style={animatedStyle}>
      <ScrollArrow contextName="scrollViewKeyboardAvoid" {...scrollArrowProps} position="top" />
      <Animated.ScrollView
        ref={scrollViewRef}
        onLayout={onLayout}
        onScroll={onScrollHandler}
        {...props}
      >
        <KeyboardAvoidingViewProvider
          isInputFieldFocused={isInputFieldFocused}
          contentHeight={contentHeight}
          contentHeightWhenKeyboardIsVisible={contentHeightWhenKeyboardIsVisible}
          scrollViewRef={scrollViewRef}
        >
          {children}
        </KeyboardAvoidingViewProvider>
      </Animated.ScrollView>
      <ScrollArrow contextName="scrollViewKeyboardAvoid" {...scrollArrowProps} position="bottom" />
    </AnimatedWrapper>
  );
};

export default ScrollView;
