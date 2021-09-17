import Animated, { runOnJS, withSpring } from 'react-native-reanimated';
import { Keyboard } from 'react-native';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_SPRING_CONFIG } from '../constants/animations';
import { SCROLL_EVENT_THROTTLE } from '../constants/configs';

interface Props {
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isPanning: Animated.SharedValue<boolean>;
  isPanningDown: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingCard: Animated.SharedValue<boolean>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  innerScrollY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  type: string;
}

export const onGestureHandlerCard = ({
  isInputFieldFocused,
  isPanning,
  isPanningDown,
  isCardCollapsed,
  isAnimationRunning,
  isScrollingCard,
  prevDragY,
  dragY,
  translationY,
  snapPointBottom,
  innerScrollY,
  type,
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    ctx.startY = type === 'content' ? translationY.value - innerScrollY.value : translationY.value;
    isPanningDown.value = false;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';

    if (!isInputFieldFocused.value) {
      isPanning.value = true;
      prevDragY.value = translationY.value;
      dragY.value = ctx.startY + event.translationY;

      if (dragY.value > 0) {
        if (
          isScrollingCard.value &&
          ctx.startY + event.translationY > prevDragY.value &&
          type === 'content'
        ) {
          if (innerScrollY.value === 0 || innerScrollY.value <= SCROLL_EVENT_THROTTLE) {
            translationY.value = dragY.value;
          }
        } else {
          translationY.value = dragY.value;
        }
      }
    }
  },
  onEnd: (): void => {
    'worklet';

    isCardCollapsed.value = isPanningDown.value;
    isAnimationRunning.value = true;
    isPanning.value = false;

    if (isInputFieldFocused && innerScrollY.value === 0) {
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
  },
});
