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
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP } from '../../../constants/styles';
import {
  onOuterScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
} from '../../../worklets';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

const isAndroid = Platform.OS === 'android';
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

const Sheet: React.FC = () => {
  const panGestureOuterRef = useRef<PanGestureHandler>();
  const keyboardContext = useContext(KeyboardContext);
  const { cardHeight, innerScrollY, translationY } = useContext(ReusablePropsContext);
  const {
    scrollY,
    snapEffectDirection,
    snapPointBottom: configSnapPointBottom,
    header,
    contentComponent,
    footerComponent,
    onLayoutRequest,
  } = useContext(UserConfigurationContext);

  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const isInputFieldFocused = useSharedValue(false);

  const panGestureType = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);

  const extraSnapPointBottomOffset = useMemo(
    () => (isAndroid ? 0 : CLOSE_OPEN_CARD_BUTTON_HITSLOP),
    [],
  );

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0
      ? cardHeight.value - configSnapPointBottom + extraSnapPointBottomOffset
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
        isCardCollapsed,
        snapPointBottom,
        direction,
      });
    },
    [keyboardContext, isCardCollapsed, isAnimationRunning, snapPointBottom, translationY],
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
        onOuterScrollReaction({
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
                scrollY={scrollY}
                snapPointBottom={snapPointBottom}
                onPress={actionRequestCloseOrOpenCard}
              />
            </Animated.View>
          </PanGestureHandler>
          <Content
            gestureHandler={gestureHandler}
            panGestureType={panGestureType}
            isScrollingCard={isScrollingCard}
            isInputFieldFocused={isInputFieldFocused}
          >
            {contentComponent}
          </Content>
        </Animated.View>
      </View>
      <Footer />
    </>
  );
};

export default Sheet;
