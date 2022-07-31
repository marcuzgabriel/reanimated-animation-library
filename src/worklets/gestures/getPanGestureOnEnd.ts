import { Keyboard } from 'react-native';
import { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { runOnJS, withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP } from '../../constants/animations';
import type { GestureParams } from '../getGestures';

export const getPanGestureOnEnd =
  ({
    prevDragY,
    translationY,
    dragY,
    isPanningDown,
    isPanning,
    isCardCollapsed,
    isInputFieldFocused,
    isAnimationRunning,
    snapPointBottom,
    springConfig,
    innerScrollY,
  }: GestureParams): ((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void) =>
  (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
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
        springConfig,
        isAnimationComplete => {
          if (isAnimationComplete) {
            isAnimationRunning.value = false;
          }
        },
      );
    }
  };
