import Animated, { cancelAnimation, withSpring } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_BOTTOM,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
} from '../constants/animations';

interface Props {
  derivedIsCollapsed: Animated.SharedValue<number>;
  isPanGestureAnimationRunning: Animated.SharedValue<number>;
  isCardCollapsed: Animated.SharedValue<number>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

export const onPressRequestCloseOrOpenCard = ({
  translation,
  isPanGestureAnimationRunning,
  derivedIsCollapsed,
  isCardCollapsed,
}: Props): void => {
  'worklet';

  cancelAnimation(translation.y);
  isPanGestureAnimationRunning.value = 1;
  isCardCollapsed.value = isCardCollapsed.value === 0 ? 1 : 0;

  translation.y.value = withSpring(
    derivedIsCollapsed.value === 0 ? DEFAULT_SNAP_POINT_BOTTOM : DEFAULT_SNAP_POINT_TOP,
    DEFAULT_TIMING_CONFIG,
    () => {
      isPanGestureAnimationRunning.value = 0;
    },
  );
};
