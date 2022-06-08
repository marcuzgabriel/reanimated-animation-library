import type { GestureParams } from '../getGestures';

export const getPanGestureOnBegin =
  ({ startY, translationY }: GestureParams): (() => void) =>
  () => {
    'worklet';

    startY.value = translationY.value;
  };
