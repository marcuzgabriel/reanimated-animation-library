import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  cancelAnimation,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { LayoutChangeEvent } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Card from '../Card';
import {
  DEFAULT_SNAP_POINT_BOTTOM,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
} from '../../constants/animations';
import { closeOrOpenCard } from '../../worklets/closeOrOpenCard';
import {
  CARD_BOTTOM_OFFSET,
  CARD_TOP_DRAG_OFFSET,
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_CARD_TOP_POSITION,
} from '../../constants/styles';

interface WindowProp {
  windowHeight: number;
}

const Wrapper = styled.View<WindowProp>`
  display: flex;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  justify-content: flex-end;
`;
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

const ReactNativeUltimateBottomSheet: React.FC<Props> = ({
  windowHeight,
  borderTopRadius = 7,
  scrollY,
}) => {
  const shouldCardCollapse = useSharedValue(0);
  const shouldCardOpen = useSharedValue(0);
  const isAnimationRunning = useSharedValue(0);
  const isScrollingUp = useSharedValue(0);
  const isScrollingDown = useSharedValue(0);
  const isPanning = useSharedValue(0);
  const isPanGestureAnimationRunning = useSharedValue(0);
  const isPanningDown = useSharedValue(0);
  const isCardCollapsed = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const translation = {
    bottomY: useSharedValue(0),
    prevY: useSharedValue(0),
    y: useSharedValue(0),
  };

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
            closeOrOpenCard({
              isAnimationRunning,
              isScrollingDown,
              isScrollingUp,
              isCardCollapsed,
              shouldCardOpen,
              shouldCardCollapse,
              result,
              translation,
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
      cancelAnimation(translation.y);
      ctx.startY = translation.y.value;
      isPanning.value = 1;
    },
    onActive: (event, ctx) => {
      if (translation.y.value >= -CARD_TOP_DRAG_OFFSET) {
        translation.prevY.value = translation.y.value;
        translation.y.value = ctx.startY + event.translationY;
      }
    },
    onEnd: _ => {
      isPanningDown.value = translation.y.value > translation.prevY.value ? 1 : 0;
      isCardCollapsed.value = isPanningDown.value === 1 ? 1 : 0;
      isPanGestureAnimationRunning.value = 1;
      isPanning.value = 0;

      translation.y.value = withSpring(
        isPanningDown.value ? DEFAULT_SNAP_POINT_BOTTOM : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_TIMING_CONFIG,
        () => {
          isPanGestureAnimationRunning.value = 0;
        },
      );
    },
  });

  const gestureAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: translation.y.value }],
  }));

  const onLayout = (e: LayoutChangeEvent): void => {
    'worklet';

    cardHeight.value = e.nativeEvent.layout.height;
    translation.bottomY.value =
      cardHeight.value - (CARD_BOTTOM_OFFSET + CLOSE_CARD_BUTTON_HEIGHT + CLOSE_CARD_TOP_POSITION);
  };

  return (
    <Wrapper windowHeight={windowHeight}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={gestureAnimation} onLayout={onLayout}>
          <Card
            borderTopRadius={borderTopRadius}
            translation={translation}
            scrollY={scrollY}
            isPanning={isPanning}
            isScrollingDown={isScrollingDown}
            isScrollingUp={isScrollingUp}
            isCardCollapsed={isCardCollapsed}
            isPanGestureAnimationRunning={isPanGestureAnimationRunning}
          />
        </Animated.View>
      </PanGestureHandler>
    </Wrapper>
  );
};

export default ReactNativeUltimateBottomSheet;
