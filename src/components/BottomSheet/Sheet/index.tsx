import React, { useMemo, useRef, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { LayoutChangeEvent, ViewStyle, Platform, Keyboard } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler';
import Content from '../Content';
import Header from '../Header';
import Footer from '../Footer';
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP, DEFAULT_BORDER_RADIUS } from '../../../constants/styles';
import {
  onOuterScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
} from '../../../worklets';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

const HIDE_CONTENT_INTERPOLATION = 5;

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

const AnimatedContent = Animated.View;

const Sheet: React.FC = () => {
  const panGestureOuterRef = useRef<PanGestureHandler>();
  const keyboardContext = useContext(KeyboardContext);
  const { scrollY: innerScrollY, cardHeight, translationY } = useContext(
    ReusablePropsContext.bottomSheet,
  );
  const {
    scrollY: configBackgroundContentScrollY,
    snapPointBottom: configSnapPointBottom,
    borderTopLeftRadius: configBorderTopLeftRadius,
    borderTopRightRadius: configBorderTopRightRadius,
    backgroundColor,
    snapEffectDirection,
    contentComponent,
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

  const hideContentInterpolation = useSharedValue(0);
  const panGestureType = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);

  const borderTopLeftRadius = useMemo(() => configBorderTopLeftRadius ?? DEFAULT_BORDER_RADIUS, [
    configBorderTopLeftRadius,
  ]);

  const borderTopRightRadius = useMemo(() => configBorderTopRightRadius ?? DEFAULT_BORDER_RADIUS, [
    configBorderTopRightRadius,
  ]);

  const extraSnapPointBottomOffset = useMemo(
    () => (isAndroid ? 0 : CLOSE_OPEN_CARD_BUTTON_HITSLOP),
    [],
  );

  const snapPointBottom = useDerivedValue(() =>
    cardHeight.value > 0
      ? cardHeight.value - configSnapPointBottom + extraSnapPointBottomOffset
      : 0,
  );

  const derivedIsPanningValue = useDerivedValue(() => isPanning.value, [isPanning]);

  useDerivedValue(() => {
    hideContentInterpolation.value = Animated.withTiming(isCardCollapsed.value ? 5 : 0);
  }, [isCardCollapsed]);

  const actionRequestCloseOrOpenCard = useCallback(
    (direction?: string) => {
      'worklet';

      if (keyboardContext.isKeyboardVisible.value) {
        runOnJS(Keyboard.dismiss)();
      }

      if (!derivedIsPanningValue.value && !keyboardContext.isKeyboardVisible.value) {
        onActionRequestCloseOrOpenCard({
          translationY,
          isAnimationRunning,
          isCardCollapsed,
          snapPointBottom,
          direction,
        });
      }
    },
    [
      derivedIsPanningValue,
      keyboardContext,
      isCardCollapsed,
      isAnimationRunning,
      snapPointBottom,
      translationY,
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
    () => configBackgroundContentScrollY?.value,
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
    [configBackgroundContentScrollY],
  );

  const panGestureStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> =>
      getAnimatedCardStyles({
        translationY: translationY.value,
        borderTopLeftRadius,
        borderTopRightRadius,
        backgroundColor,
      }),
  );

  const animatedContentStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      opacity: interpolate(hideContentInterpolation.value, [0, HIDE_CONTENT_INTERPOLATION], [1, 0]),
    }),
    [hideContentInterpolation],
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
                scrollY={configBackgroundContentScrollY}
                snapPointBottom={snapPointBottom}
                onPress={actionRequestCloseOrOpenCard}
              />
            </Animated.View>
          </PanGestureHandler>
          <AnimatedContent style={animatedContentStyle}>
            <Content
              gestureHandler={gestureHandler}
              panGestureType={panGestureType}
              isScrollingCard={isScrollingCard}
              isInputFieldFocused={isInputFieldFocused}
            >
              {contentComponent}
            </Content>
          </AnimatedContent>
        </Animated.View>
      </View>
      <Footer />
    </>
  );
};

export default Sheet;
