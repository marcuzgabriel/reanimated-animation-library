import { Platform, Keyboard } from 'react-native';
import {
  Gesture,
  PanGesture,
  NativeGesture,
  TapGesture,
  GestureUpdateEvent,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { withSpring, runOnJS } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_SPRING_CONFIG } from '../constants/animations';

export const getGestures = (
  gestureHandlerProps: any,
  isBottomSheetInactive?: boolean,
): Record<string, PanGesture | NativeGesture | TapGesture> => {
  'worklet';

  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';

  const {
    isInputFieldFocused,
    isPanning,
    isPanningDown,
    isCardCollapsed,
    isAnimationRunning,
    isScrollable,
    prevDragY,
    dragY,
    translationY,
    scrollOffset,
    startY,
    snapPointBottom,
    innerScrollY,
  } = gestureHandlerProps;

  const panGestureOnBegin = (): void => {
    'worklet';

    startY.value = translationY.value;
  };

  const panGestureOnUpdate = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
    isHeader?: boolean,
  ): void => {
    'worklet';

    if (!isInputFieldFocused.value) {
      prevDragY.value = translationY.value;
      isPanning.value = prevDragY.value !== e.translationY;
      dragY.value = startY.value + e.translationY;

      if (dragY.value > 0) {
        /* NOTE: Transition from scroll to pan */
        if (!isHeader && isScrollable.value && e.translationY && innerScrollY.value === 0) {
          translationY.value = isIOS
            ? dragY.value - scrollOffset.value
            : dragY.value - prevDragY.value - scrollOffset.value;
        } else if (!isScrollable.value || isHeader) {
          translationY.value = dragY.value;
        }
      }
    }
  };

  const panGestureOnEnd = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): void => {
    'worklet';

    const isPanningDownWithFastRelease = prevDragY.value < dragY.value;
    const isPanningDownWithSlowRelease = prevDragY.value <= dragY.value && e.translationY > 0;

    isPanningDown.value = isPanningDownWithFastRelease || isPanningDownWithSlowRelease;
    isCardCollapsed.value = isPanningDown.value;
    isAnimationRunning.value = true;
    isPanning.value = false;

    if (isInputFieldFocused.value && innerScrollY.value === 0) {
      runOnJS(Keyboard.dismiss)();
    }

    if (!isInputFieldFocused.value) {
      translationY.value = withSpring(
        isPanningDown.value ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_SPRING_CONFIG,
        isAnimationComplete => {
          if (isAnimationComplete) {
            isAnimationRunning.value = false;
          }
        },
      );
    }
  };

  const panGestureHeader = Gesture.Pan()
    .enabled(!isBottomSheetInactive)
    .onBegin(panGestureOnBegin)
    .onUpdate(e => panGestureOnUpdate(e, true))
    .onEnd(panGestureOnEnd)
    .withTestId('panGestureHeader');

  const panGestureContent = Gesture.Pan()
    .enabled(!isWeb || !isBottomSheetInactive)
    .onBegin(panGestureOnBegin)
    .onUpdate(panGestureOnUpdate)
    .onEnd(panGestureOnEnd)
    .withTestId('panGestureContent');

  const scrollViewNativeGesture = Gesture.Native().enabled(!isWeb);

  return {
    panGestureHeader,
    panGestureContent,
    scrollViewNativeGesture,
  };
};
