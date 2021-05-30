import React, { useRef, useContext, useCallback } from 'react';
import { Platform, ViewStyle, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import FadingEdge from '../FadingEdge';
import { MAX_HEIGHT_RATIO } from '../../../constants/styles';
import ScrollArrow from '../../ScrollViewKeyboardAvoid/ScrollArrow';
import ScrollViewKeyboardAvoid from '../../ScrollViewKeyboardAvoid';
import { SCROLL_EVENT_THROTTLE, ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

interface Props {
  panGestureType: Animated.SharedValue<number>;
  isScrollingCard: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
}

const ContentWrapper = styled.View``;

const Content: React.FC<Props> = ({
  gestureHandler,
  panGestureType,
  isScrollingCard,
  isInputFieldFocused,
  children,
}) => {
  const windowHeight = useWindowDimensions().height;
  const { fadingScrollEdges, scrollArrows } = useContext(UserConfigurationContext);
  const { scrollViewRef, scrollY, scrollViewHeight, contentHeight, footerHeight } = useContext(
    ReusablePropsContext.bottomSheet,
  );

  const panGestureInnerRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();
  const contentHeightWhenKeyboardIsVisible = useSharedValue(0);
  const maxHeight = useDerivedValue(
    () => (windowHeight - footerHeight.value) * MAX_HEIGHT_RATIO,
    [footerHeight],
  );

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const maxHeightStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      marginBottom: footerHeight.value,
      maxHeight: maxHeight.value,
      height:
        contentHeightWhenKeyboardIsVisible.value > 0
          ? contentHeightWhenKeyboardIsVisible.value
          : '100%',
    }),
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        scrollViewHeight.value = e.nativeEvent.layout.height;
      }
    },
    [scrollViewHeight],
  );

  return (
    <PanGestureHandler
      enabled={Platform.OS !== 'web'}
      ref={panGestureInnerRef}
      shouldCancelWhenOutside={false}
      simultaneousHandlers={nativeViewGestureRef}
      onGestureEvent={gestureHandler}
      onHandlerStateChange={(): void => {
        if (panGestureType.value !== 1) {
          panGestureType.value = 1;
        }
      }}
    >
      <Animated.View onLayout={onLayout} style={maxHeightStyle}>
        {fadingScrollEdges?.isEnabled && (
          <FadingEdge
            position="top"
            nativeColor={fadingScrollEdges.nativeBackgroundColor}
            webColor={fadingScrollEdges.webBackgroundColorTop}
          />
        )}
        <ScrollArrow contextName="bottomSheet" position="top" />
        <NativeViewGestureHandler
          ref={nativeViewGestureRef}
          shouldCancelWhenOutside={false}
          simultaneousHandlers={panGestureInnerRef}
        >
          <ScrollViewKeyboardAvoid
            contextName="bottomSheet"
            ref={scrollViewRef}
            bounces={false}
            alwaysBounceVertical={false}
            directionalLockEnabled={true}
            scrollArrows={scrollArrows}
            fadingEdgeLength={ANDROID_FADING_EDGE_LENGTH}
            onScroll={onScrollHandler}
            onContentSizeChange={(_, height): void => {
              contentHeight.value = height;
            }}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
            onTouchMove={(): void => {
              isScrollingCard.value = true;
            }}
            onTouchEnd={(): void => {
              isScrollingCard.value = false;
            }}
          >
            <KeyboardAvoidingViewProvider
              contextName="bottomSheet"
              isInputFieldFocused={isInputFieldFocused}
              contentHeightWhenKeyboardIsVisible={contentHeightWhenKeyboardIsVisible}
            >
              {children}
            </KeyboardAvoidingViewProvider>
          </ScrollViewKeyboardAvoid>
        </NativeViewGestureHandler>
        <ScrollArrow contextName="bottomSheet" position="bottom" />
        {fadingScrollEdges?.isEnabled && (
          <FadingEdge
            position="bottom"
            nativeColor={fadingScrollEdges.nativeBackgroundColor}
            webColor={fadingScrollEdges.webBackgroundColorBottom}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Content;
