import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ScrollArrow from '../ScrollArrow';
import FadingEdge from '../../ScrollViewKeyboardAvoid/FadingEdge';
import {
  FADING_EDGE_COLOR_NATIVE,
  FADING_EDGE_COLOR_WEB_BOTTOM,
  FADING_EDGE_COLOR_WEB_TOP,
} from '../../../constants/styles';
import { ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import type { MixedScrollViewProps } from '../../../types';

interface Props extends MixedScrollViewProps {
  scrollViewRef: React.RefObject<Animated.ScrollView> | any;
}

const AnimatedWrapper = Animated.createAnimatedComponent(
  styled.View`
    flex: 1;
  `,
);

const ScrollView: React.FC<Props> = props => {
  const {
    scrollViewRef,
    keyboardAvoidBottomMargin,
    disableScrollAnimation,
    fadingScrollEdges,
    isKeyboardAvoidDisabled,
    scrollArrows,
    onContentSizeChange,
    onIsInputFieldFocusedRequest,
    children,
  } = props;

  const {
    isEnabled: isFadingScrollEdgeEnabled,
    androidFadingEdgeLength,
    nativeBackgroundColor,
    webBackgroundColorBottom,
    webBackgroundColorTop,
  } = fadingScrollEdges ?? {};

  const scrollViewHeight = useSharedValue(0);
  const scrollViewWidth = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollingLength = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const contentHeightWhenKeyboardIsVisible = useSharedValue(0);
  const translationY = useSharedValue(0);
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
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    }),
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        scrollViewHeight.value = e.nativeEvent.layout.height;
        scrollViewWidth.value = e.nativeEvent.layout.width;
      }
    },
    [scrollViewHeight, scrollViewWidth],
  );

  const fadingEdgeAndroid = useMemo(
    () => androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH,
    [androidFadingEdgeLength],
  );
  const fadingEdgeNativeBackgroundColor = useMemo(
    () => nativeBackgroundColor ?? FADING_EDGE_COLOR_NATIVE,
    [nativeBackgroundColor],
  );
  const fadingEdgeWebBackgroundColorTop = useMemo(
    () => webBackgroundColorTop ?? FADING_EDGE_COLOR_WEB_TOP,
    [webBackgroundColorTop],
  );
  const fadingEdgeWebBackgroundColorBottom = useMemo(
    () => webBackgroundColorBottom ?? FADING_EDGE_COLOR_WEB_BOTTOM,
    [webBackgroundColorBottom],
  );

  const scrollArrowProps = useMemo(
    () => ({
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollY,
      scrollViewHeight,
      scrollViewWidth,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
      isInputFieldFocused,
    }),
    [
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollY,
      scrollViewHeight,
      scrollViewWidth,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
      isInputFieldFocused,
    ],
  );

  return (
    <AnimatedWrapper style={animatedStyle}>
      {isFadingScrollEdgeEnabled && (
        <FadingEdge
          position="top"
          isScrollable={isScrollable}
          isScrolledToTop={isScrolledToTop}
          isScrolledToEnd={isScrolledToEnd}
          scrollViewWidth={scrollViewWidth}
          nativeColor={fadingEdgeNativeBackgroundColor}
          webColor={fadingEdgeWebBackgroundColorTop}
        />
      )}
      {scrollArrows?.isEnabled && (
        <ScrollArrow {...scrollArrowProps} contextName="scrollViewKeyboardAvoid" position="top" />
      )}
      <Animated.ScrollView
        {...props}
        ref={scrollViewRef}
        fadingEdgeLength={isFadingScrollEdgeEnabled ? fadingEdgeAndroid : 0}
        onLayout={onLayout}
        onScroll={onScrollHandler}
        onContentSizeChange={(width, height): void => {
          if (typeof onContentSizeChange === 'function') {
            onContentSizeChange(width, height);
          }

          contentHeight.value = height;
        }}
      >
        <KeyboardAvoidingViewProvider
          isInputFieldFocused={isInputFieldFocused}
          isKeyboardAvoidDisabled={isKeyboardAvoidDisabled}
          contentHeight={contentHeight}
          contentHeightWhenKeyboardIsVisible={contentHeightWhenKeyboardIsVisible}
          disableScrollAnimation={disableScrollAnimation}
          keyboardAvoidBottomMargin={keyboardAvoidBottomMargin}
          translationY={translationY}
          scrollViewRef={scrollViewRef}
          scrollViewHeight={scrollViewHeight}
          onIsInputFieldFocusedRequest={onIsInputFieldFocusedRequest}
        >
          {children}
        </KeyboardAvoidingViewProvider>
      </Animated.ScrollView>
      {scrollArrows?.isEnabled && (
        <ScrollArrow
          {...scrollArrowProps}
          contextName="scrollViewKeyboardAvoid"
          position="bottom"
        />
      )}
      {isFadingScrollEdgeEnabled && (
        <FadingEdge
          position="bottom"
          isScrollable={isScrollable}
          isScrolledToTop={isScrolledToTop}
          isScrolledToEnd={isScrolledToEnd}
          scrollViewWidth={scrollViewWidth}
          nativeColor={fadingEdgeNativeBackgroundColor}
          webColor={fadingEdgeWebBackgroundColorBottom}
        />
      )}
    </AnimatedWrapper>
  );
};

export default ScrollView;
