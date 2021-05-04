import React, { useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LayoutChangeEvent, ViewStyle, useWindowDimensions, Platform } from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import Content from 'components/Content';
import Header from 'components/Header';
import { DEFAULT_SNAP_POINT_BOTTOM_RATIO } from 'constants/animations';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';
import { MAX_HEIGHT_RATIO } from 'constants/styles';
import { onScrollReaction, getAnimatedCardStyles, gestureHandlerCard } from 'worklets';

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

const ContentWrapper = styled.View``;

const ReactNativeUltimateBottomSheet: React.FC<Props> = ({ scrollY }) => {
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

  const panGestureType = useSharedValue(0);

  const innerScrollY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0 ? cardHeight.value * DEFAULT_SNAP_POINT_BOTTOM_RATIO : 0,
  );

  const windowHeight = useWindowDimensions().height;
  const maxHeight = useMemo(() => windowHeight * MAX_HEIGHT_RATIO, [windowHeight]);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      innerScrollY.value = e.contentOffset.y;
    },
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    gestureHandlerCard({
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
    () => scrollY?.value,
    (result: number | undefined, previous: number | null | undefined) => {
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
    },
    [scrollY],
  );

  const panGestureStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => getAnimatedCardStyles(translationY.value),
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      cardHeight.value = e.nativeEvent.layout.height;
    },
    [cardHeight],
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
              isAnimationRunning={isAnimationRunning}
              isCardCollapsed={isCardCollapsed}
              isPanning={isPanning}
            />
          </Animated.View>
        </PanGestureHandler>
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
            <Animated.View style={{ maxHeight }}>
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
                  scrollEventThrottle={SCROLL_EVENT_THROTTLE}
                  onTouchMove={(): void => {
                    isScrollingCard.value = true;
                  }}
                  onTouchEnd={(): void => {
                    isScrollingCard.value = false;
                  }}
                >
                  <Content />
                </Animated.ScrollView>
              </NativeViewGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </ContentWrapper>
      </Animated.View>
    </View>
  );
};

export default ReactNativeUltimateBottomSheet;
