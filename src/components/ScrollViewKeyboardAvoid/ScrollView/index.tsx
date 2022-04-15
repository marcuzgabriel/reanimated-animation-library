import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, Platform } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { onScrollGetScrollingMeasures } from '../../../worklets';
import ScrollArrow from '../ScrollArrow';
import FadingEdge from '../../ScrollViewKeyboardAvoid/FadingEdge';
import {
  FADING_EDGE_COLOR_NATIVE,
  FADING_EDGE_COLOR_WEB_BOTTOM,
  FADING_EDGE_COLOR_WEB_TOP,
} from '../../../constants/styles';
import { ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import type { ScrollViewProps } from '../../../types';
import { GestureDetector } from 'react-native-gesture-handler';

const AnimatedWrapper = Animated.createAnimatedComponent(styled.View``);
const isWeb = Platform.OS === 'web';

const ScrollView: React.FC<ScrollViewProps> = props => {
  const {
    scrollViewRef,
    connectScrollViewMeasuresToAnimationValues,
    keyboardAvoidBottomMargin,
    fadingScrollEdges,
    isKeyboardAvoidDisabled,
    scrollArrows,
    translationYValues,
    gesture,
    scrollTo,
    onContentSizeChange,
    onIsInputFieldFocusedRequest,
    children,
  } = props;

  const { isKeyboardVisible, keyboardHeight } = React.useContext(KeyboardContext);

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
  const translationY = useSharedValue(0);
  const isFocusInputFieldAnimationRunning = useSharedValue(false);
  const isInputFieldFocused = useSharedValue(false);
  const isScrolledToTop = useSharedValue(false);
  const isScrolledToEnd = useSharedValue(false);
  const isScrollable = useSharedValue(false);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    flex: isWeb ? 1 : 0,
    transform: [
      {
        translateY: translationY.value,
      },
    ],
  }));

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        scrollViewHeight.value = e.nativeEvent.layout.height;
        scrollViewWidth.value = e.nativeEvent.layout.width;
      }
    },
    [scrollViewHeight, scrollViewWidth],
  );

  const fadingEdgeAndroid = androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH;
  const fadingEdgeNativeBackgroundColor = nativeBackgroundColor ?? FADING_EDGE_COLOR_NATIVE;
  const fadingEdgeWebBackgroundColorTop = webBackgroundColorTop ?? FADING_EDGE_COLOR_WEB_TOP;
  const fadingEdgeWebBackgroundColorBottom =
    webBackgroundColorBottom ?? FADING_EDGE_COLOR_WEB_BOTTOM;

  const connectionProps: Record<
    string,
    Animated.SharedValue<number | boolean | undefined>
  > = useMemo(
    () => ({
      scrollY,
      scrollViewHeight,
      contentHeight,
      keyboardHeight,
      isKeyboardVisible,
      isInputFieldFocused,
      isScrollable,
    }),
    [
      scrollY,
      scrollViewHeight,
      contentHeight,
      keyboardHeight,
      isKeyboardVisible,
      isInputFieldFocused,
      isScrollable,
    ],
  );

  const scrollArrowProps = useMemo(
    () => ({
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollTo,
      scrollY,
      scrollViewHeight,
      scrollViewWidth,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
      isInputFieldFocused,
      isKeyboardVisible,
    }),
    [
      scrollViewRef,
      scrollArrows,
      contentHeight,
      scrollTo,
      scrollY,
      scrollViewHeight,
      scrollViewWidth,
      scrollingLength,
      isScrolledToTop,
      isScrolledToEnd,
      isScrollable,
      isInputFieldFocused,
      isKeyboardVisible,
    ],
  );

  const fadingEdgeProps = useMemo(
    () => ({
      isFocusInputFieldAnimationRunning,
      isScrollable,
      isScrolledToTop,
      isScrolledToEnd,
      scrollViewWidth,
      nativeColor: fadingEdgeNativeBackgroundColor,
    }),
    [
      isFocusInputFieldAnimationRunning,
      isScrollable,
      isScrolledToTop,
      isScrolledToEnd,
      scrollViewWidth,
      fadingEdgeNativeBackgroundColor,
    ],
  );

  useAnimatedReaction(
    () => ({
      scrollY: scrollY.value,
      contentHeight: contentHeight.value,
      scrollViewHeight: scrollViewHeight.value,
    }),
    () => {
      if (contentHeight.value > 0 && scrollViewHeight.value > 0) {
        return onScrollGetScrollingMeasures({
          scrollY,
          scrollViewHeight,
          scrollingLength,
          isScrolledToTop,
          isScrolledToEnd,
          isScrollable,
          contentHeight,
        });
      }
    },
    [scrollY, contentHeight, scrollViewHeight, onScrollGetScrollingMeasures],
  );

  useDerivedValue(() => {
    if (connectScrollViewMeasuresToAnimationValues) {
      Object.keys(connectScrollViewMeasuresToAnimationValues).forEach(key => {
        if (
          Object.keys(connectionProps).includes(key) &&
          connectScrollViewMeasuresToAnimationValues[key].value !== connectionProps[key].value
        ) {
          connectScrollViewMeasuresToAnimationValues[key].value = connectionProps[key].value;
        }
      });
    }
  }, [connectScrollViewMeasuresToAnimationValues]);

  return (
    <AnimatedWrapper style={animatedStyle}>
      {isFadingScrollEdgeEnabled && (
        <FadingEdge
          {...fadingEdgeProps}
          position="top"
          webColor={fadingEdgeWebBackgroundColorTop}
        />
      )}
      {scrollArrows?.isEnabled && <ScrollArrow {...scrollArrowProps} position="top" />}
      <GestureDetector gesture={gesture}>
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
            translationYValues={translationYValues}
            isKeyboardAvoidDisabled={isKeyboardAvoidDisabled}
            isFocusInputFieldAnimationRunning={isFocusInputFieldAnimationRunning}
            contentHeight={contentHeight}
            keyboardAvoidBottomMargin={keyboardAvoidBottomMargin}
            onIsInputFieldFocusedRequest={onIsInputFieldFocusedRequest}
          >
            {children}
          </KeyboardAvoidingViewProvider>
        </Animated.ScrollView>
      </GestureDetector>
      {scrollArrows?.isEnabled && <ScrollArrow {...scrollArrowProps} position="bottom" />}
      {isFadingScrollEdgeEnabled && (
        <FadingEdge
          {...fadingEdgeProps}
          position="bottom"
          webColor={fadingEdgeWebBackgroundColorBottom}
        />
      )}
    </AnimatedWrapper>
  );
};

export default ScrollView;
