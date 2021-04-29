import React, { useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  withSpring,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedScrollHandler,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { LayoutChangeEvent, Platform, StyleSheet, useWindowDimensions } from 'react-native';
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
import { CARD_STYLE_ANDROID_AND_WEB, CARD_STYLE_IOS } from '../../constants/styles';
import { onScrollRequestCloseOrOpenCard } from '../../worklets/onScrollRequestCloseOrOpenCard';

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
  z-index: 2;
`;

const ReactNativeUltimateBottomSheet: React.FC<Props> = ({ scrollY }) => {
  const [isScrollable, setIsScrollable] = React.useState<boolean>(false);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const isPanning = useSharedValue(0);
  const isPanningDown = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);

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

      translation.y.value = withSpring(
        isPanningDown.value === 1 ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_TIMING_CONFIG,
        () => {
          isAnimationRunning.value = false;
        },
      );
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

  const panGestureStyle = useAnimatedStyle((): any =>
    Platform.OS === 'ios'
      ? {
          ...CARD_STYLE_IOS,
          transform: [{ translateY: translation.y.value }],
        }
      : {
          ...CARD_STYLE_ANDROID_AND_WEB,
          transform: [{ translateY: translation.y.value }],
        },
  );

  const onLayout = (e: LayoutChangeEvent): void => {
    cardHeight.value = e.nativeEvent.layout.height;
  };

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      innerScrollY.value = e.contentOffset.y;
    },
  });

  const ScrollViewStyle = { flex: 1, maxHeight };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View onLayout={onLayout} style={panGestureStyle}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
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
        <PanGestureHandler enabled={!isScrollable} onGestureEvent={gestureHandler}>
          <Animated.View style={ScrollViewStyle}>
            <Animated.ScrollView
              scrollEnabled={isScrollable}
              onScroll={onScrollHandler}
              onContentSizeChange={(_, contentHeight): void => {
                if (contentHeight > maxHeight) {
                  setIsScrollable(true);
                }
              }}
              scrollEventThrottle={16}
              ref={scrollViewRef}
              bounces={false}
            >
              <Card />
            </Animated.ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </View>
  );
};

export default ReactNativeUltimateBottomSheet;
