import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  cancelAnimation,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { LayoutChangeEvent, Platform } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Card from '../Card';
import {
  DEFAULT_SNAP_POINT_BOTTOM_RATIO,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
} from '../../constants/animations';
import { CARD_BOTTOM_OFFSET } from '../../constants/styles';
import { onScrollRequestCloseOrOpenCard } from '../../worklets/onScrollRequestCloseOrOpenCard';
interface Props {
  attachOuterScrollY?: Animated.Value<number>;
  overdragResistanceFactor?: number;
  borderTopRadius?: number;
  height?: number;
  width?: number;
  scrollViewRef?: React.RefObject<Animated.ScrollView> | null;
  previousScrollY?: Animated.SharedValue<number>;
  scrollY?: Animated.SharedValue<number>;
  contentSize?: Animated.SharedValue<number>;
  layoutHeight?: Animated.SharedValue<number>;
  resetToDefaultPosition?: boolean;
  hasPanGesture?: boolean;
  autoSlideToTop?: boolean;
  autoSlideToBottom?: boolean;
  floatOnKeyboard?: boolean;
  windowHeight: number;
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

interface WindowProp {
  windowHeight: number;
}

const Wrapper = styled.View<WindowProp>`
  display: flex;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  justify-content: flex-end;
`;

const ReactNativeUltimateBottomSheet: React.FC<Props> = ({
  windowHeight,
  borderTopRadius = 7,
  scrollY,
}) => {
  const isAnimationRunning = useSharedValue(0);
  const isScrollingUp = useSharedValue(0);
  const isScrollingDown = useSharedValue(0);
  const isPanning = useSharedValue(0);
  const isPanGestureAnimationRunning = useSharedValue(0);
  const isPanningDown = useSharedValue(0);
  const isCardCollapsed = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const translation = {
    prevY: useSharedValue(0),
    y: useSharedValue(0),
  };

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0 ? cardHeight.value * DEFAULT_SNAP_POINT_BOTTOM_RATIO : 0,
  );

  useAnimatedReaction(
    () => scrollY?.value,
    (result: number | undefined, previous: number | null | undefined) => {
      if (result && previous) {
        if (result !== previous) {
          isScrollingDown.value = result > previous ? 1 : 0;
          isScrollingUp.value = result > previous ? 0 : 1;
        }

        if (
          result >= DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM ||
          result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM
        ) {
          if (
            result < DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM &&
            isScrollingDown.value === 1 &&
            isCardCollapsed.value === 0
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
      if (isPanGestureAnimationRunning.value === 1) {
        cancelAnimation(translation.y);
        isPanGestureAnimationRunning.value = 0;
      }
    },
    onActive: (event, ctx) => {
      isPanning.value = 1;
      translation.prevY.value = translation.y.value;
      translation.y.value =
        ctx.startY + event.translationY < 0 ? 0 : ctx.startY + event.translationY;
    },
    onEnd: _ => {
      isPanningDown.value = translation.y.value > translation.prevY.value ? 1 : 0;
      isCardCollapsed.value = isPanningDown.value === 1 ? 1 : 0;
      isPanGestureAnimationRunning.value = 1;
      isPanning.value = 0;

      translation.y.value = withSpring(
        isPanningDown.value ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_TIMING_CONFIG,
        () => {
          isPanGestureAnimationRunning.value = 0;
        },
      );
    },
  });

  const panGestureStyle = useAnimatedStyle(() =>
    Platform.OS === 'ios'
      ? {
          bottom: -CARD_BOTTOM_OFFSET,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          backgroundColor: 'lightgrey',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          transform: [{ translateY: translation.y.value }],
        }
      : {
          bottom: -CARD_BOTTOM_OFFSET,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          backgroundColor: 'lightgrey',
          elevation: 10,
          transform: [{ translateY: translation.y.value }],
        },
  );

  const onLayout = (e: LayoutChangeEvent): void => {
    cardHeight.value = e.nativeEvent.layout.height;
  };

  return (
    <Wrapper windowHeight={windowHeight}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={panGestureStyle} onLayout={onLayout}>
          <Card
            borderTopRadius={borderTopRadius}
            translation={translation}
            scrollY={scrollY}
            isPanning={isPanning}
            isScrollingDown={isScrollingDown}
            isScrollingUp={isScrollingUp}
            isCardCollapsed={isCardCollapsed}
            isPanGestureAnimationRunning={isPanGestureAnimationRunning}
            snapPointBottom={snapPointBottom}
          />
        </Animated.View>
      </PanGestureHandler>
    </Wrapper>
  );
};

export default ReactNativeUltimateBottomSheet;
