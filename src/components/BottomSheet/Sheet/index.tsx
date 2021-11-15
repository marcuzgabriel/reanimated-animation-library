import React, { useMemo, useRef, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import Animated, {
  AnimatedStyleProp,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedRef,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { LayoutChangeEvent, ViewStyle, Keyboard } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler';
import { DEFAULT_BORDER_RADIUS } from '../../../constants/styles';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import {
  onInitializationCloseRequest,
  onOuterScrollReaction,
  onActionRequestCloseOrOpenCard,
  getAnimatedCardStyles,
  onGestureHandlerCard,
  onSnapHideContentOrFooterReaction,
} from '../../../worklets';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { useCloseOrOpenRequestCallback } from '../../../hooks/useCloseOrOpenRequestCallback';
import Content from '../Content';
import Header from '../Header';
import Footer from '../Footer';

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

  const {
    scrollY: innerScrollY,
    cardHeight,
    translationY,
    isInputFieldFocused,
    isKeyboardVisible,
    hideFooterInterpolation,
  } = useContext(ReusablePropsContext.bottomSheet);

  const {
    snapPointBottom: configSnapPointBottom,
    borderTopLeftRadius: configBorderTopLeftRadius,
    borderTopRightRadius: configBorderTopRightRadius,
    testID,
    hideContentOnCardCollapse,
    hideFooterOnCardCollapse,
    outerScrollEvent,
    extraSnapPointBottomOffset,
    backgroundColor,
    snapEffectDirection,
    contentComponent,
    initializeBottomSheetAsClosed,
    isBottomSheetInactive,
    openBottomSheetRequest,
    closeBottomSheetRequest,
    onLayoutRequest,
  } = useContext(UserConfigurationContext);

  const measureRef = useAnimatedRef<Animated.View>();

  const hasCloseOrOpenRequest =
    openBottomSheetRequest?.isEnabled || closeBottomSheetRequest?.isEnabled;

  const isMounted = useSharedValue(false);
  const isPanning = useSharedValue(false);
  const isPanningDown = useSharedValue(false);
  const isAnimationRunning = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const isInitializedAsClosed = useSharedValue(false);
  const hideContentInterpolation = useSharedValue(0);
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

      if (isKeyboardVisible?.value) {
        runOnJS(Keyboard.dismiss)();
      }

      if (!derivedIsPanningValue.value && !isKeyboardVisible?.value) {
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
      isKeyboardVisible,
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

        /* NOTE: This check is neccesary for having a
        open / close request based on measureRef. */
        if (!isMounted.value) {
          isMounted.value = true;
        }

        if (onLayoutRequest) {
          onLayoutRequest(e.nativeEvent.layout.height);
        }
      }
    },
    [cardHeight, isMounted, onLayoutRequest],
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
      if (!isBottomSheetInactive && result !== previous && (result === 'up' || result === 'down')) {
        actionRequestCloseOrOpenCard(result);
      }
    },
    [snapEffectDirection, isBottomSheetInactive],
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
    (): AnimatedStyleProp<ViewStyle> =>
      getAnimatedCardStyles({
        translationY: translationY.value,
        borderTopLeftRadius,
        borderTopRightRadius,
        backgroundColor,
      }),
  );

  const animatedContentStyle = useAnimatedStyle((): AnimatedStyleProp<ViewStyle> => {
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

  /* NOTE: Handler for closing BottomSheet on initialization */
  useAnimatedReaction(
    () => snapPointBottom.value,
    (result: number, previous: number | null | undefined) => {
      if (result !== previous && initializeBottomSheetAsClosed && !isInitializedAsClosed.value) {
        onInitializationCloseRequest({
          isCardCollapsed,
          isAnimationRunning,
          isInitializedAsClosed,
          snapEffectDirection,
          translationY,
          snapPointBottom,
        });
      }
    },
    [snapPointBottom, initializeBottomSheetAsClosed],
  );

  /* NOTE: Handler for open and close request */
  useCloseOrOpenRequestCallback({
    hasCloseOrOpenRequest,
    measureRef,
    isMounted,
    isCardCollapsed,
    isAnimationRunning,
  });

  return (
    <>
      <View testID={testID} pointerEvents="box-none">
        <Animated.View ref={measureRef} onLayout={onLayout} style={panGestureStyle}>
          <PanGestureHandler
            enabled={!isBottomSheetInactive}
            ref={panGestureOuterRef}
            onGestureEvent={gestureHandlerHeader}
          >
            <Animated.View>
              <Header
                scrollY={outerScrollEvent?.scrollY}
                snapPointBottom={snapPointBottom}
                onPress={(): void | undefined =>
                  isBottomSheetInactive ? undefined : actionRequestCloseOrOpenCard()
                }
              />
            </Animated.View>
          </PanGestureHandler>
          <AnimatedContent style={animatedContentStyle}>
            <Content gestureHandler={gestureHandlerContent} isScrollingCard={isScrollingCard}>
              {contentComponent}
            </Content>
          </AnimatedContent>
        </Animated.View>
      </View>
      <Footer isCardCollapsed={isCardCollapsed} />
    </>
  );
};

export default Sheet;
