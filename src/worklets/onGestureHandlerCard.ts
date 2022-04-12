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

interface ReturnFunctionTypes {
  onStart: (_: Record<string, number>, ctx: Record<string, number>) => void;
  onActive: (event: Record<string, number>, ctx: Record<string, number>) => void;
  onEnd: (event: Record<string, number>) => void;
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
}: Props): ReturnFunctionTypes => ({
  onStart: (_, ctx): void => {
    'worklet';

    ctx.startY = type === 'content' ? translationY.value - innerScrollY.value : translationY.value;
  },
  onActive: (event, ctx): void => {
    'worklet';

    if (!isInputFieldFocused.value) {
      isPanning.value = prevDragY.value !== translationY.value;
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
  onEnd: (event): void => {
    'worklet';

    const isPanningDownWithFastRelease = prevDragY.value < dragY.value;
    const isPanningDownWithSlowRelease = prevDragY.value <= dragY.value && event.translationY > 0;

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
  },
});
