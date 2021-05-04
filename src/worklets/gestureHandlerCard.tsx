import Animated, { withSpring } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
  OFFSET_START_SNAP_TO_BOTTOM,
} from 'constants/animations';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';
import { withDecay } from '../hocs/withDecay';

interface Props {
  isPanning: Animated.SharedValue<boolean>;
  isPanningDown: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isScrollingEnabled: Animated.SharedValue<boolean>;
  isCardSnapped: Animated.SharedValue<boolean>;
  prevDragY: Animated.SharedValue<number>;
  dragY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  innerScrollY: Animated.SharedValue<number>;
  panGestureType: Animated.SharedValue<number>;
  derivedIsScrollingCard: Animated.SharedValue<boolean>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
}

export const gestureHandlerCard = ({
  isPanning,
  isPanningDown,
  isCardCollapsed,
  isAnimationRunning,
  isCardSnapped,
  prevDragY,
  dragY,
  translationY,
  snapPointBottom,
  derivedIsScrollingCard,
  innerScrollY,
  panGestureType,
}: Props): Record<string, unknown> => ({
  onStart: (_: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';
    ctx.startY = translationY.value - innerScrollY.value;
    isPanningDown.value = false;
  },
  onActive: (event: Record<string, number>, ctx: Record<string, number>): void => {
    'worklet';
    isPanning.value = true;
    prevDragY.value = translationY.value;
    isPanningDown.value = ctx.startY + event.translationY > prevDragY.value ? true : false;
    dragY.value = ctx.startY + event.translationY;

    if (dragY.value > 0) {
      if (derivedIsScrollingCard.value && isPanningDown.value && panGestureType.value === 1) {
        if (innerScrollY.value === 0 || innerScrollY.value <= SCROLL_EVENT_THROTTLE) {
          isCardSnapped.value = true;
          translationY.value = dragY.value;
        }
      } else {
        isCardSnapped.value = false;
        translationY.value = dragY.value;
      }
    }
  },
  onEnd: (): void => {
    'worklet';

    isCardCollapsed.value = isPanningDown.value;
    isAnimationRunning.value = true;
    isPanning.value = false;

    translationY.value = withSpring(
      isPanningDown.value && translationY.value >= OFFSET_START_SNAP_TO_BOTTOM
        ? snapPointBottom.value
        : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      () => {
        isAnimationRunning.value = false;
      },
    );
  },
});
