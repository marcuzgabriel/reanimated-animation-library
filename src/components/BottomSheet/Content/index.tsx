import React, { useRef } from 'react';
import { Platform, ViewStyle, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedRef,
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
import { MAX_HEIGHT_RATIO } from 'constants/styles';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';
import FocusedInputFieldProvider from 'containers/FocusedInputFieldProvider';

interface Props {
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  panGestureType: Animated.SharedValue<number>;
  innerScrollY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
  isScrollingCard: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
}

const ContentWrapper = styled.View`
  overflow: hidden;
`;

const Content: React.FC<Props> = ({
  gestureHandler,
  panGestureType,
  innerScrollY,
  isScrollingCard,
  isInputFieldFocused,
  translationY,
  footerHeight,
  children,
}) => {
  const windowHeight = useWindowDimensions().height;

  const panGestureInnerRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const isScrollable = useSharedValue(false);

  const cardContentHeight = useSharedValue(0);
  const cardHeightWhenKeyboardIsVisible = useSharedValue(0);
  const maxHeight = useSharedValue(windowHeight * MAX_HEIGHT_RATIO);

  const derivedMarginBottom = useDerivedValue(() => footerHeight.value);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      innerScrollY.value = e.contentOffset.y;
    },
  });

  const maxHeightStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      marginBottom: derivedMarginBottom.value,
      maxHeight: maxHeight.value - derivedMarginBottom.value,
      height:
        cardHeightWhenKeyboardIsVisible.value > 0 ? cardHeightWhenKeyboardIsVisible.value : '100%',
    }),
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
        <Animated.View style={maxHeightStyle}>
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
              onScroll={onScrollHandler}
              onContentSizeChange={(_, height): void => {
                isScrollable.value = height > maxHeight.value;
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
              <FocusedInputFieldProvider
                scrollViewRef={scrollViewRef}
                translationY={translationY}
                isInputFieldFocused={isInputFieldFocused}
                cardHeightWhenKeyboardIsVisible={cardHeightWhenKeyboardIsVisible}
                cardContentHeight={cardContentHeight}
              >
                {children}
              </FocusedInputFieldProvider>
            </Animated.ScrollView>
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </ContentWrapper>
  );
};

export default Content;
