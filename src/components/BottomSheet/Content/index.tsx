import React, { useRef, useContext, useCallback } from 'react';
import { Platform, ViewStyle, LayoutChangeEvent } from 'react-native';
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
import ScrollArrow from '../ScrollArrow';
import FadingEdge from '../FadingEdge';
import { MAX_HEIGHT_RATIO } from '../../../constants/styles';
import { SCROLL_EVENT_THROTTLE, ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';

const FADING_EDGE_COLOR_NATIVE = 'grey';
const FADING_EDGE_COLOR_WEB_TOP = { from: 'rgba(128,128,128,1)', to: 'rgba(128,128,128,0)' };
const FADING_EDGE_COLOR_WEB_BOTTOM = { from: 'rgba(128,128,128,0)', to: 'rgba(128,128,128,1)' };
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
  const {
    scrollViewRef,
    innerScrollY,
    scrollViewHeight,
    cardContentHeight,
    footerHeight,
    windowHeight,
  } = useContext(ReusablePropsContext);

  const panGestureInnerRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();
  const cardHeightWhenKeyboardIsVisible = useSharedValue(0);
  const maxHeight = useDerivedValue(
    () => (windowHeight - footerHeight.value) * MAX_HEIGHT_RATIO,
    [footerHeight],
  );

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      innerScrollY.value = e.contentOffset.y;
    },
  });

  const maxHeightStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      marginBottom: footerHeight.value,
      maxHeight: maxHeight.value,
      height:
        cardHeightWhenKeyboardIsVisible.value > 0 ? cardHeightWhenKeyboardIsVisible.value : '100%',
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
    <ContentWrapper>
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
          <FadingEdge
            position="top"
            nativeColor={FADING_EDGE_COLOR_NATIVE}
            webColor={FADING_EDGE_COLOR_WEB_TOP}
          />
          <ScrollArrow position="top" />
          <NativeViewGestureHandler
            ref={nativeViewGestureRef}
            shouldCancelWhenOutside={false}
            simultaneousHandlers={panGestureInnerRef}
          >
            <Animated.ScrollView
              ref={scrollViewRef}
              bounces={false}
              alwaysBounceVertical={false}
              directionalLockEnabled={true}
              fadingEdgeLength={ANDROID_FADING_EDGE_LENGTH}
              onScroll={onScrollHandler}
              onContentSizeChange={(_, height): void => {
                cardContentHeight.value = height;
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
                isInputFieldFocused={isInputFieldFocused}
                cardHeightWhenKeyboardIsVisible={cardHeightWhenKeyboardIsVisible}
              >
                {children}
              </KeyboardAvoidingViewProvider>
            </Animated.ScrollView>
          </NativeViewGestureHandler>
          <ScrollArrow position="bottom" />
          <FadingEdge
            position="bottom"
            nativeColor={FADING_EDGE_COLOR_NATIVE}
            webColor={FADING_EDGE_COLOR_WEB_BOTTOM}
          />
        </Animated.View>
      </PanGestureHandler>
    </ContentWrapper>
  );
};

export default Content;
