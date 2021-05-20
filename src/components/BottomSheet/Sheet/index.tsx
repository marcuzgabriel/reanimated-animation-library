import React, { useMemo, useRef, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { LayoutChangeEvent, ViewStyle, Platform, Keyboard } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler';
import Content from '../Content';
import Header from '../Header';
import Footer from '../Footer';
import { OFFSET_SNAP_POINT_BOTTOM } from 'constants/animations';
import { CLOSE_CARD_BUTTON_HEIGHT, CLOSE_OPEN_CARD_BUTTON_HITSLOP } from 'constants/styles';
import {
  onScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
} from 'worklets';
import { KeyboardContext } from 'containers/KeyboardProvider';

const isAndroid = Platform.OS === 'android';
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
  contentComponent: React.ReactNode;
  footerComponent: React.ReactNode;
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

const Sheet: React.FC<Props> = ({
  scrollY,
  snapEffectDirection,
  contentComponent,
  footerComponent,
  onLayoutRequest,
}) => {
  const keyboardContext = useContext(KeyboardContext);

  const panGestureOuterRef = useRef<PanGestureHandler>();

  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const isInputFieldFocused = useSharedValue(false);

  const panGestureType = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const footerTranslationY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const headerHeight = useSharedValue(0);
  const footerHeight = useSharedValue(0);

  const extraSnapPointBottomOffset = useMemo(
    () => (isAndroid ? 0 : CLOSE_OPEN_CARD_BUTTON_HITSLOP),
    [],
  );

  const derivedIsCollapsed = useDerivedValue(() => isCardCollapsed.value);
  const derivedIsPanning = useDerivedValue(() => isPanning.value);
  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0
      ? cardHeight.value -
        CLOSE_CARD_BUTTON_HEIGHT -
        OFFSET_SNAP_POINT_BOTTOM +
        extraSnapPointBottomOffset
      : 0,
  );

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
      prevDragY,
      dragY,
      translationY,
      snapPointBottom,
      panGestureType,
      innerScrollY,
    }),
    [cardHeight],
  );

  /* Panning direction reaction */
  useAnimatedReaction(
    () => translationY.value,
    (result: number, previous: number | null | undefined) => {
      if (result && previous && result !== previous) {
        isPanningDown.value = result > previous;
      }
    },
    [translationY],
  );

  /* Snap-effect reaction */
  useAnimatedReaction(
    () => snapEffectDirection?.value,
    (result: string | undefined, previous: string | null | undefined) => {
      if (result !== previous && (result === 'up' || result === 'down')) {
        actionRequestCloseOrOpenCard(result);
      }
    },
    [snapEffectDirection],
  );

  useAnimatedReaction(
    () => scrollY?.value,
    (result: number | undefined, previous: number | null | undefined) => {
      if (!isInputFieldFocused.value) {
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

  return (
    <>
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
                headerHeight={headerHeight}
                onPress={actionRequestCloseOrOpenCard}
              />
            </Animated.View>
          </PanGestureHandler>
          <Content
            gestureHandler={gestureHandler}
            panGestureType={panGestureType}
            innerScrollY={innerScrollY}
            isScrollingCard={isScrollingCard}
            isInputFieldFocused={isInputFieldFocused}
            translationY={translationY}
            footerTranslationY={footerTranslationY}
            footerHeight={footerHeight}
            headerHeight={headerHeight}
          >
            {contentComponent}
          </Content>
        </Animated.View>
      </View>
      <Footer
        cardHeight={cardHeight}
        headerHeight={headerHeight}
        footerHeight={footerHeight}
        translationY={translationY}
        footerTranslationY={footerTranslationY}
      >
        {footerComponent}
      </Footer>
    </>
  );
};

export default Sheet;
