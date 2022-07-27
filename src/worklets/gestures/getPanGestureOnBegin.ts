import type { GestureParams } from '../getGestures';

export const getPanGestureOnBegin =
  ({ startY, translationY }: GestureParams): (() => void) =>
  () => {
    startY.value = translationY.value;
  };
