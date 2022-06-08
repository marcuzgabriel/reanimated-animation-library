import { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import type { GestureParams } from '../getGestures';

export const getPanGestureOnUpdate =
  ({
    prevDragY,
    translationY,
    dragY,
    startY,
    isPanning,
    isScrollable,
    isInputFieldFocused,
    isIOS,
    innerScrollY,
    scrollOffset,
  }: GestureParams): ((
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
    isHeader?: boolean,
  ) => void) =>
  (e: GestureUpdateEvent<PanGestureHandlerEventPayload>, isHeader?: boolean) => {
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
