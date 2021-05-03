import React, { useRef, useMemo } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Platform, LayoutChangeEvent, ViewStyle, useWindowDimensions } from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import Card from 'components/Card';
import Header from 'components/Header';
import {
  DEFAULT_SNAP_POINT_BOTTOM_RATIO,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
} from 'constants/animations';
import { MAX_HEIGHT_RATIO } from 'constants/styles';
import { onScrollReaction, gestureHandlerCard, getAnimatedCardStyles } from 'worklets';
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

const ContentWrapper = styled.View`
  overflow: hidden;
`;

const ReactNativeUltimateBottomSheet: React.FC<Props> = ({ scrollY }) => {
  const panGestureInnerRef = useRef<PanGestureHandler>();
  const panGestureOuterRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();

  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);

  const translationY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);

  const translationYInner = useSharedValue(0);

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0 ? cardHeight.value * DEFAULT_SNAP_POINT_BOTTOM_RATIO : 0,
  );

  const windowHeight = useWindowDimensions().height;
  const maxHeight = useMemo(() => windowHeight * MAX_HEIGHT_RATIO, [windowHeight]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    gestureHandlerCard({
      isPanning,
      isPanningDown,
      isCardCollapsed,
      isAnimationRunning,
      prevDragY,
      dragY,
      translationY,
      snapPointBottom,
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

  const scrollViewStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      maxHeight,
      transform: [{ translateY: translationYInner.value }],
    }),
  );

  const panGestureStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => {
      return getAnimatedCardStyles(translationY.value);
    },
  );

  const onLayout = (e: LayoutChangeEvent): void => {
    cardHeight.value = e.nativeEvent.layout.height;
  };

  return (
    <View pointerEvents="box-none">
      <Animated.View onLayout={onLayout} style={panGestureStyle}>
        <PanGestureHandler
          ref={panGestureOuterRef}
          simultaneousHandlers={panGestureInnerRef}
          onGestureEvent={gestureHandler}
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
            simultaneousHandlers={nativeViewGestureRef}
            onGestureEvent={gestureHandler}
          >
            <Animated.View style={scrollViewStyle}>
              <NativeViewGestureHandler
                ref={nativeViewGestureRef}
                simultaneousHandlers={panGestureInnerRef}
              >
                <Animated.ScrollView>
                  <Card />
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
