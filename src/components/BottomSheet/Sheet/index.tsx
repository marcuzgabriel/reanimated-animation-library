import React, { useRef, useMemo, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import Animated, {
  Easing,
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  LayoutChangeEvent,
  ViewStyle,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import Content from '../Content';
import Header from '../Header';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';
import { OFFSET_SNAP_POINT_BOTTOM, DEFAULT_TIMING_CONFIG } from 'constants/animations';
import {
  MAX_HEIGHT_RATIO,
  CLOSE_CARD_BUTTON_HEIGHT,
  KEYBOARD_CARD_HEIGHT_RATIO,
} from 'constants/styles';
import {
  onScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
} from 'worklets';
import { KeyboardContext } from 'containers/KeyboardProvider';

interface Props {
  attachOuterScrollY?: Animated.Value<number>;
  overdragResistanceFactor?: number;
  borderTopRadius?: number;
  height?: number;
  width?: number;
  scrollViewRef?: React.RefObject<Animated.ScrollView> | null;
  previousScrollY?: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  contentSize?: Animated.SharedValue<number>;
  layoutHeight?: Animated.SharedValue<number>;
  resetToDefaultPosition?: boolean;
  hasPanGesture?: boolean;
  autoSlideToTop?: boolean;
  autoSlideToBottom?: boolean;
  floatOnKeyboard?: boolean;
  snapPoints?: { [key: string]: number };
  innerScrolling?: {
    hasInnerScrolling?: boolean;
    hasFadingEdges?: boolean;
    hasScrollingArrows?: boolean;
    arrowBottomIcon?: React.ReactNode;
    arrowTopIcon?: React.ReactNode;
    maxHeightRatio?: number;
  };
  children?: React.ReactNode;
  bottomActions?: React.ReactNode;
  onAnimationDoneRequest?: void;
  snapEffectDirection?: Animated.SharedValue<string>;
  onLayoutRequest?: (height: number) => void;
}

interface AnimatedGHContext {
  [key: string]: number;
  startX: number;
  startY: number;
}

const View = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 2;
`;

const ContentWrapper = styled.View`
  overflow: hidden;
`;

const Sheet: React.FC<Props> = ({ scrollY, snapEffectDirection, onLayoutRequest }) => {
  const windowHeight = useWindowDimensions().height;
  const keyboardContext = useContext(KeyboardContext);

  const panGestureInnerRef = useRef<PanGestureHandler>();
  const panGestureOuterRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const isCardSnapped = useSharedValue(false);
  const isScrollable = useSharedValue(false);
  const isInputFieldFocused = useSharedValue(false);

  const keyboardOffset = useSharedValue(0);
  const panGestureType = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);

  const derivedIsCollapsed = useDerivedValue(() => isCardCollapsed.value);
  const derivedIsPanning = useDerivedValue(() => isPanning.value);
  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0
      ? cardHeight.value - CLOSE_CARD_BUTTON_HEIGHT - OFFSET_SNAP_POINT_BOTTOM
      : 0,
  );

  const maxHeight = useMemo(() => windowHeight * MAX_HEIGHT_RATIO, [windowHeight]);

  const actionRequestCloseOrOpenCard = useCallback(
    (direction?: string) => {
      'worklet';

      if (keyboardContext.isKeyboardVisible.value) {
        runOnJS(Keyboard.dismiss)();
      }

      onActionRequestCloseOrOpenCard({
        translationY,
        isAnimationRunning,
        derivedIsCollapsed,
        derivedIsPanning,
        isCardCollapsed,
        snapPointBottom,
        direction,
      });
    },
    [
      keyboardContext,
      isCardCollapsed,
      isAnimationRunning,
      snapPointBottom,
      translationY,
      derivedIsPanning,
      derivedIsCollapsed,
    ],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        cardHeight.value = e.nativeEvent.layout.height;

        if (onLayoutRequest) {
          onLayoutRequest(e.nativeEvent.layout.height);
        }
      }
    },
    [cardHeight, onLayoutRequest],
  );

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      innerScrollY.value = e.contentOffset.y;
    },
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerCard({
      isInputFieldFocused,
      isScrollingCard,
      isPanning,
      isPanningDown,
      isCardCollapsed,
      isAnimationRunning,
      isCardSnapped,
      prevDragY,
      dragY,
      translationY,
      snapPointBottom,
      panGestureType,
      innerScrollY,
    }),
  );

  useAnimatedReaction(
    () => snapEffectDirection?.value,
    (result: string | undefined, previous: string | null | undefined) => {
      if (result !== previous && (result === 'up' || result === 'down')) {
        console.log('[ANIMATION REACTION #2]');
        actionRequestCloseOrOpenCard(result);
      }
    },
    [snapEffectDirection],
  );

  useAnimatedReaction(
    () => scrollY?.value,
    (result: number, previous: number | null | undefined) => {
      if (!isInputFieldFocused.value) {
        console.log('[ANIMATION REACTION #3]');
        onScrollReaction({
          result,
          previous,
          isCardCollapsed,
          isScrollingUp,
          isScrollingDown,
          isAnimationRunning,
          translationY,
          snapPointBottom,
        });
      }
    },
    [scrollY],
  );

  const panGestureStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => getAnimatedCardStyles(translationY.value),
  );

  const maxHeightStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      maxHeight,
      height: '100%',
    }),
  );

  return (
    <View pointerEvents="box-none">
      <Animated.View onLayout={onLayout} style={panGestureStyle}>
        <PanGestureHandler
          ref={panGestureOuterRef}
          onGestureEvent={gestureHandler}
          onHandlerStateChange={(): void => {
            if (panGestureType.value !== 0) {
              panGestureType.value = 0;
            }
          }}
        >
          <Animated.View>
            <Header
              snapPointBottom={snapPointBottom}
              scrollY={scrollY}
              translationY={translationY}
              onPress={actionRequestCloseOrOpenCard}
            />
          </Animated.View>
        </PanGestureHandler>
        <ContentWrapper>
          <KeyboardAvoidingView behavior="position">
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
                    onScroll={onScrollHandler}
                    onContentSizeChange={(_, contentHeight): void => {
                      isScrollable.value = contentHeight > maxHeight;
                    }}
                    scrollEventThrottle={SCROLL_EVENT_THROTTLE}
                    onTouchMove={(): void => {
                      isScrollingCard.value = true;
                    }}
                    onTouchEnd={(): void => {
                      isScrollingCard.value = false;
                    }}
                  >
                    <Content
                      isInputFieldFocused={isInputFieldFocused}
                      translationY={translationY}
                      keyboardOffset={keyboardOffset}
                      scrollViewRef={scrollViewRef}
                      maxHeight={maxHeight}
                    />
                  </Animated.ScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </KeyboardAvoidingView>
        </ContentWrapper>
      </Animated.View>
    </View>
  );
};

export default Sheet;
