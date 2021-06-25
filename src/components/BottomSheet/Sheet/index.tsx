import React, { useMemo, useRef, useContext, useCallback, useEffect } from 'react';
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
import { LayoutChangeEvent, ViewStyle, Keyboard } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler';
import Content from '../Content';
import Header from '../Header';
import Footer from '../Footer';
import { DEFAULT_BORDER_RADIUS } from '../../../constants/styles';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import {
  onOuterScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
  onSnapHideContentOrFooterReaction,
} from '../../../worklets';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

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
  const {
    scrollY: innerScrollY,
    cardHeight,
    translationY,
    isInputFieldFocused,
  } = useContext(ReusablePropsContext.bottomSheet);
  const {
    snapPointBottom: configSnapPointBottom,
    borderTopLeftRadius: configBorderTopLeftRadius,
    borderTopRightRadius: configBorderTopRightRadius,
    hideContentOnCardCollapse,
    hideFooterOnCardCollapse,
    outerScrollEvent,
    extraSnapPointBottomOffset,
    backgroundColor,
    snapEffectDirection,
    contentComponent,
    onLayoutRequest,
    resetCardPosition,
  } = useContext(UserConfigurationContext);

  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const hideContentInterpolation = useSharedValue(0);
  const hideFooterInterpolation = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);

  const borderTopLeftRadius = useMemo(
    () => configBorderTopLeftRadius ?? DEFAULT_BORDER_RADIUS,
    [configBorderTopLeftRadius],
  );

  const borderTopRightRadius = useMemo(
    () => configBorderTopRightRadius ?? DEFAULT_BORDER_RADIUS,
    [configBorderTopRightRadius],
  );

  const snapPointBottom = useDerivedValue(() => {
    const extraSnapPointOffset = extraSnapPointBottomOffset ?? 0;

    return cardHeight.value > 0
      ? cardHeight.value - configSnapPointBottom - extraSnapPointOffset
      : 0;
  }, [cardHeight, configSnapPointBottom]);

  const derivedIsPanningValue = useDerivedValue(() => isPanning.value, [isPanning]);

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

  const gestureHandlerProps = {
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
    innerScrollY,
  };

  const gestureHandlerHeader = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerCard({
      ...gestureHandlerProps,
      type: 'header',
    }),
    [cardHeight],
  );

  const gestureHandlerContent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerCard({
      ...gestureHandlerProps,
      type: 'content',
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

  useAnimatedReaction(
    () => translationY.value,
    (result: number, previous: number | null | undefined) => {
      if (result !== previous) {
        const hideContentOffset = hideContentOnCardCollapse?.offset ?? 0;
        const hideFooterOffset = hideFooterOnCardCollapse?.offset ?? 0;

        onSnapHideContentOrFooterReaction({
          result,
          snapPointBottom,
          hideContentInterpolation,
          hideFooterInterpolation,
          hideContentOffset,
          hideFooterOffset,
          isHideContentOnCardCollapseEnabled: hideContentOnCardCollapse?.isEnabled ?? false,
          isHideFooterOnCardCollapseEnabled: hideFooterOnCardCollapse?.isEnabled ?? false,
          isAnimationRunning,
        });
      }
    },
    [translationY, snapPointBottom, isAnimationRunning, hideContentInterpolation],
  );

  /* Snap effect reaction */
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
    () => outerScrollEvent?.scrollY?.value,
    (result: number | undefined, previous: number | null | undefined) => {
      if (!isInputFieldFocused.value && typeof result === 'number' && result >= 0) {
        onOuterScrollReaction({
          result,
          previous,
          isCardCollapsed,
          isScrollingUp,
          isScrollingDown,
          isAnimationRunning,
          translationY,
          snapPointBottom,
          outerScrollEvent,
        });
      }
    },
    [outerScrollEvent],
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

  const animatedContentStyle = useAnimatedStyle((): Animated.AnimatedStyleProp<ViewStyle> => {
    if (hideContentOnCardCollapse?.isEnabled) {
      return {
        opacity: interpolate(
          hideContentInterpolation.value,
          [0, HIDE_CONTENT_OUTPUT_RANGE],
          [1, 0],
        ),
      };
    }
    return {};
  }, [hideContentInterpolation]);

  useEffect(() => {
    if (resetCardPosition && isCardCollapsed.value) {
      actionRequestCloseOrOpenCard();
    }
  }, [resetCardPosition, isCardCollapsed, actionRequestCloseOrOpenCard]);

  return (
    <>
      <View pointerEvents="box-none">
        <Animated.View onLayout={onLayout} style={panGestureStyle}>
          <PanGestureHandler ref={panGestureOuterRef} onGestureEvent={gestureHandlerHeader}>
            <Animated.View>
              <Header
                scrollY={outerScrollEvent?.scrollY}
                snapPointBottom={snapPointBottom}
                onPress={actionRequestCloseOrOpenCard}
              />
            </Animated.View>
          </PanGestureHandler>
          <AnimatedContent style={animatedContentStyle}>
            <Content
              gestureHandler={gestureHandlerContent}
              isScrollingCard={isScrollingCard}
              isInputFieldFocused={isInputFieldFocused}
            >
              {contentComponent}
            </Content>
          </AnimatedContent>
        </Animated.View>
      </View>
      <Footer hideFooterInterpolation={hideFooterInterpolation} />
    </>
  );
};

export default Sheet;
