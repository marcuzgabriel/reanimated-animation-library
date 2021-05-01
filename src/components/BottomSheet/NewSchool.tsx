import React, { useRef } from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Platform, LayoutChangeEvent, ViewStyle, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler';

import Card from '../Card';
import Header from '../Header';
import {
  DEFAULT_SNAP_POINT_BOTTOM_RATIO,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
} from '../../constants/animations';
import { CARD_BOTTOM_OFFSET } from '../../constants/styles';
import { onScrollRequestCloseOrOpenCard } from '../../worklets/onScrollRequestCloseOrOpenCard';
import { AnimatedStyles } from '../../types/index';
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

  const isPanning = useSharedValue(0);
  const isPanningDown = useSharedValue(0);

  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);

  const translationYInner = useSharedValue(0);
  const isPannedToTopInner = useSharedValue(false);
  const fluentPanEventTrigger = useSharedValue(false);

  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);

  const translation = {
    prevY: useSharedValue(0),
    y: useSharedValue(0),
  };

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0 ? cardHeight.value * DEFAULT_SNAP_POINT_BOTTOM_RATIO : 0,
  );

  const windowHeight = useWindowDimensions().height;
  const maxHeight = windowHeight * 0.6;

  interface AnimatedGHContext {
    [key: string]: number;
    startX: number;
    startY: number;
  }

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      ctx.startY = translation.y.value;
    },
    onActive: (event, ctx) => {
      isPanningDown.value = ctx.startY + event.translationY > prevDragY.value ? 1 : 0;
      prevDragY.value = dragY.value;
      dragY.value = ctx.startY + event.translationY;
      translation.y.value = isCardCollapsed.value && dragY.value <= 0 ? 0 : dragY.value;
    },
    onEnd: _ => {
      isCardCollapsed.value = isPanningDown.value === 1;
      isAnimationRunning.value = true;
      isPanning.value = 0;
      isPannedToTopInner.value = false;
      translationYInner.value = 0;

      translation.y.value = withSpring(
        isPanningDown.value === 1 ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_TIMING_CONFIG,
        () => {
          isAnimationRunning.value = false;
        },
      );
    },
  });

  interface AnimatedGHContextTwo {
    [key: string]: number;
    startX: number;
    startY: number;
  }

  const gestureHandlerInner = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContextTwo
  >({
    onStart: (_, ctx) => {
      ctx.startY = translationYInner.value;
    },
    onActive: (event, ctx) => {
      isPannedToTopInner.value = translationYInner.value > 0;
      console.log(translationYInner.value);

      if (!isPannedToTopInner.value) {
        translationYInner.value = ctx.startY + event.translationY;
      } else if (ctx.startY + event.translationY > 10) {
        fluentPanEventTrigger.value = true;
        isPanningDown.value = 1;
        translation.y.value = ctx.startY + event.translationY;
      }
    },
    onEnd: _ => {
      if (fluentPanEventTrigger.value) {
        translation.y.value = withSpring(
          isPanningDown.value === 1 ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
          DEFAULT_TIMING_CONFIG,
          () => {
            isAnimationRunning.value = false;
          },
        );
      }
    },
  });

  useAnimatedReaction(
    () => scrollY?.value,
    (result: number | undefined, previous: number | null | undefined) => {
      if (result && previous) {
        if (result !== previous) {
          isScrollingDown.value = result > previous;
          isScrollingUp.value = result < previous;
        }

        if (
          result >= DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ||
          result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM
        ) {
          if (
            result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM &&
            isScrollingDown.value &&
            !isCardCollapsed.value
          ) {
            translation.y.value = result;
          } else {
            onScrollRequestCloseOrOpenCard({
              isAnimationRunning,
              isScrollingDown,
              isScrollingUp,
              isCardCollapsed,
              result,
              translation,
              snapPointBottom,
            });
          }
        }
      }
    },
    [scrollY],
  );

  const ScrollViewStyle = useAnimatedStyle((): any => ({
    maxHeight,
    transform: [{ translateY: translationYInner.value }],
  }));

  const panGestureStyle = useAnimatedStyle(
    (): AnimatedStyles<ViewStyle> =>
      Platform.OS === 'ios'
        ? {
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            bottom: -CARD_BOTTOM_OFFSET,
            backgroundColor: 'lightgrey',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            transform: [{ translateY: translation.y.value }],
          }
        : {
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            bottom: 0,
            backgroundColor: 'lightgrey',
            elevation: 10,
            transform: [{ translateY: translation.y.value }],
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
              translation={translation}
              isAnimationRunning={isAnimationRunning}
              isCardCollapsed={isCardCollapsed}
            />
          </Animated.View>
        </PanGestureHandler>
        <ContentWrapper>
          <PanGestureHandler
            ref={panGestureInnerRef}
            simultaneousHandlers={panGestureOuterRef}
            onGestureEvent={gestureHandlerInner}
          >
            <Animated.View style={ScrollViewStyle}>
              <Card />
            </Animated.View>
          </PanGestureHandler>
        </ContentWrapper>
      </Animated.View>
    </View>
  );
};

export default ReactNativeUltimateBottomSheet;
