import React, { useMemo, useRef, useContext, useCallback } from 'react';
import { Platform, ViewStyle, LayoutChangeEvent, useWindowDimensions } from 'react-native';
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
import ScrollArrow from '../../ScrollViewKeyboardAvoid/ScrollArrow';
import ScrollViewKeyboardAvoid from '../../ScrollViewKeyboardAvoid';
import FadingEdge from '../../ScrollViewKeyboardAvoid/FadingEdge';
import { MAX_HEIGHT_RATIO } from '../../../constants/styles';
import { SCROLL_EVENT_THROTTLE, ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import {
  FADING_EDGE_COLOR_NATIVE,
  FADING_EDGE_COLOR_WEB_BOTTOM,
  FADING_EDGE_COLOR_WEB_TOP,
} from '../../../constants/styles';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

interface Props {
  panGestureType: Animated.SharedValue<number>;
  isScrollingCard: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
}

const Content: React.FC<Props> = ({
  gestureHandler,
  panGestureType,
  isScrollingCard,
  isInputFieldFocused,
  children,
}) => {
  const panGestureInnerRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();
  const contentHeightWhenKeyboardIsVisible = useSharedValue(0);

  const windowHeight = useWindowDimensions().height;
  const { fadingScrollEdges, scrollArrows, maxHeight: configMaxHeight } = useContext(
    UserConfigurationContext,
  );
  const { scrollViewRef, scrollY, scrollViewHeight, contentHeight, footerHeight } = useContext(
    ReusablePropsContext.bottomSheet,
  );
  const {
    isEnabled: isFadingScrollEdgeEnabled,
    androidFadingEdgeLength,
    nativeBackgroundColor,
    webBackgroundColorBottom,
    webBackgroundColorTop,
  } = fadingScrollEdges ?? {};

  const fadingEdgeAndroid = useMemo(() => androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH, [
    androidFadingEdgeLength,
  ]);
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

  const maxHeight = useDerivedValue(
    () => configMaxHeight ?? (windowHeight - footerHeight.value) * MAX_HEIGHT_RATIO,
    [footerHeight, configMaxHeight],
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
            nativeColor={fadingEdgeNativeBackgroundColor}
            webColor={fadingEdgeWebBackgroundColorTop}
          />
        )}
        {scrollArrows?.isEnabled && (
          <ScrollArrow
            isInputFieldFocused={isInputFieldFocused}
            contextName="bottomSheet"
            position="top"
          />
        )}
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
            fadingEdgeLength={isFadingScrollEdgeEnabled ? fadingEdgeAndroid : 0}
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
        {scrollArrows?.isEnabled && (
          <ScrollArrow
            isInputFieldFocused={isInputFieldFocused}
            contextName="bottomSheet"
            position="bottom"
          />
        )}
        {fadingScrollEdges?.isEnabled && (
          <FadingEdge
            position="bottom"
            nativeColor={fadingEdgeNativeBackgroundColor}
            webColor={fadingEdgeWebBackgroundColorBottom}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Content;
