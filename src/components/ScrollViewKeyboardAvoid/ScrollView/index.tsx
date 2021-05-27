import React, { useCallback, useContext, useMemo } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import ScrollArrow from '../ScrollArrow';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import type { MixedScrollViewProps } from '../../../types';
interface Props extends MixedScrollViewProps {
  scrollViewRef: React.RefObject<Animated.ScrollView> | any;
}

const ScrollViewStandAlone: React.FC<Props> = props => {
  const {
    contentHeight,
    scrollArrows,
    scrollViewRef,
    cardHeightWhenKeyboardIsVisible,
    children,
  } = props;

  const {
    isInputFieldFocused,
    scrollViewHeight,
    scrollY,
    scrollingLength,
    isScrolledToTop,
    isScrolledToEnd,
    isScrollable,
  } = useContext(ReusablePropsContext.scrollViewKeyboardAvoid);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

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
    <>
      <ScrollArrow {...scrollArrowProps} position="top" />
      <Animated.ScrollView
        ref={scrollViewRef}
        onLayout={onLayout}
        onScroll={onScrollHandler}
        {...props}
      >
        <KeyboardAvoidingViewProvider
          isInputFieldFocused={isInputFieldFocused}
          contentHeight={contentHeight}
          cardHeightWhenKeyboardIsVisible={cardHeightWhenKeyboardIsVisible}
          scrollViewRef={scrollViewRef}
        >
          {children}
        </KeyboardAvoidingViewProvider>
      </Animated.ScrollView>
      <ScrollArrow {...scrollArrowProps} position="bottom" />
    </>
  );
};

export default ScrollViewStandAlone;
