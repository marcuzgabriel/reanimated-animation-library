import React, { useMemo, useContext, useCallback } from 'react';
import { LayoutChangeEvent, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedRef,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { DEFAULT_BORDER_RADIUS } from '../../../constants/styles';
import { DEFAULT_SPRING_CONFIG, HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import {
  getAnimatedCardStyles,
  onInitializationCloseRequest,
  onOuterScrollReaction,
  onActionRequestCloseOrOpenCard,
  onGestureHideContentOrFooterReaction,
  onGestureHandlerCard,
} from '../../../worklets';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { useCloseOrOpenRequestCallback } from '../../../hooks/useCloseOrOpenRequestCallback';
import Content from '../Content';
import Header from '../Header';
import Footer from '../Footer';
import SmoothAppearance from '../SmoothAppearance';

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
  const {
    scrollY: innerScrollY,
    scrollViewRef,
    cardHeight,
    translationY,
    isInputFieldFocused,
    isKeyboardVisible,
    hideFooterInterpolation,
    smoothAppearanceClock,
  } = useContext(ReusablePropsContext.bottomSheet);

  const {
    snapPointBottom: configSnapPointBottom,
    borderTopLeftRadius: configBorderTopLeftRadius,
    borderTopRightRadius: configBorderTopRightRadius,
    testID,
    smoothAppearance,
    hideContentOnCardCollapse,
    hideFooterOnCardCollapse,
    outerScrollEvent,
    extraSnapPointBottomOffset,
    backgroundColor,
    snapEffectDirection,
    springConfig,
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
  const isScrollable = useSharedValue(false);
  const isScrollingUp = useSharedValue(false);
  const isScrollingDown = useSharedValue(false);
  const isScrollingCard = useSharedValue(false);
  const isCardCollapsed = useSharedValue(false);
  const isInitializedAsClosed = useSharedValue(false);
  const scrollOffset = useSharedValue(0);
  const hideContentInterpolation = useSharedValue(0);
  const startY = useSharedValue(0);
  const prevDragY = useSharedValue(0);
  const dragY = useSharedValue(0);

  const borderTopLeftRadius = configBorderTopLeftRadius ?? DEFAULT_BORDER_RADIUS;
  const borderTopRightRadius = configBorderTopRightRadius ?? DEFAULT_BORDER_RADIUS;
  const derivedBackgroundColor = backgroundColor ?? 'lightgrey';
  const hasSmoothAppearance = typeof smoothAppearance?.waitForContent === 'boolean';
  const { emptyContentHeight } = smoothAppearance ?? {};
  const derivedSpringConfig = useMemo(
    () => ({ ...DEFAULT_SPRING_CONFIG, ...(springConfig ?? {}) }),
    [springConfig],
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
          springConfig: derivedSpringConfig,
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
      derivedSpringConfig,
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

  const gestureHandlerParams = {
    isInputFieldFocused,
    isScrollable,
    isScrollingCard,
    isPanning,
    isPanningDown,
    isCardCollapsed,
    isAnimationRunning,
    prevDragY,
    dragY,
    translationY,
    scrollOffset,
    scrollViewRef,
    snapPointBottom,
    springConfig: derivedSpringConfig,
    startY,
    innerScrollY,
  };

  const closeOrOpenRequestCallbackParams = {
    hasCloseOrOpenRequest,
    measureRef,
    isMounted,
    isCardCollapsed,
    isAnimationRunning,
    extraSnapPointBottomOffset,
    snapEffectDirection,
    openBottomSheetRequest,
    closeBottomSheetRequest,
    scrollViewRef,
    translationY,
    snapPointBottom: configSnapPointBottom,
    springConfig: derivedSpringConfig,
    scrollY: innerScrollY,
  };

  const gestureHandlerHeader = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerCard({
      ...gestureHandlerParams,
      type: 'header',
    }),
    [cardHeight],
  );

  const gestureHandlerContent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >(
    onGestureHandlerCard({
      ...gestureHandlerParams,
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

        onGestureHideContentOrFooterReaction({
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
          springConfig: derivedSpringConfig,
          outerScrollEvent,
        });
      }
    },
    [outerScrollEvent],
  );

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
          springConfig: derivedSpringConfig,
          translationY,
          snapPointBottom,
        });
      }
    },
    [snapPointBottom, initializeBottomSheetAsClosed],
  );

  const animatedBottomSheetStyle = useAnimatedStyle(() =>
    getAnimatedCardStyles({
      translationY: hasSmoothAppearance
        ? interpolate(
            smoothAppearanceClock.value,
            [0, 20],
            [emptyContentHeight ?? 0, translationY.value],
          )
        : translationY.value,
      borderTopLeftRadius,
      borderTopRightRadius,
      backgroundColor: derivedBackgroundColor,
    }),
  );

  const animatedStyleHeader = useAnimatedStyle(() => ({
    zIndex: 1,
  }));

  const animatedContentStyle = useAnimatedStyle(() => {
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

  /* NOTE: Handler for open and close request */
  useCloseOrOpenRequestCallback(closeOrOpenRequestCallbackParams);

  return (
    <>
      <View testID={testID} pointerEvents="box-none">
        <Animated.View ref={measureRef} onLayout={onLayout} style={animatedBottomSheetStyle}>
          <SmoothAppearance>
            <GestureHandlerRootView>
              <PanGestureHandler
                enabled={!isBottomSheetInactive}
                onGestureEvent={gestureHandlerHeader}
              >
                <Animated.View style={animatedStyleHeader}>
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
                <Content
                  isScrollable={isScrollable}
                  isScrollingCard={isScrollingCard}
                  scrollOffset={scrollOffset}
                  gestureHandler={gestureHandlerContent}
                >
                  {contentComponent}
                </Content>
              </AnimatedContent>
            </GestureHandlerRootView>
          </SmoothAppearance>
        </Animated.View>
      </View>
      <Footer isCardCollapsed={isCardCollapsed} />
    </>
  );
};

export default Sheet;
