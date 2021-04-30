import { withSpring } from 'react-native-reanimated';

export const getGestureHandlerEventsCard = ({
  translation,
  prevDragY,
  dragY,
  isCardCollapsed,
  isAnimationRunning,
  isPanningDown,
  isPanning,
  snapPointBottom,
}) => {
  const tihi = '';

  return ({
    onStart: (_, ctx) => {
      ctx.startY = translation.y.value;
    },
    onActive: (event, ctx) => {
      isPanningDown.value = ctx.startY + event.translationY > prevDragY.value ? 1 : 0;
      prevDragY.value = dragY.value;
      dragY.value = ctx.startY + event.translationY;
      translation.y.value = isCardCollapsed.value && dragY.value <= 0 ? 0 : dragY.value;
    },
    onEnd: _ => {
      isCardCollapsed.value = isPanningDown.value === 1;
      isAnimationRunning.value = true;
      isPanning.value = 0;

      translation.y.value = withSpring(
        isPanningDown.value === 1 ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
        DEFAULT_TIMING_CONFIG,
        () => {
          isAnimationRunning.value = false;
        },
      );
  })


}