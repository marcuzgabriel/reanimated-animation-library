import Animated, { cancelAnimation, withSpring } from 'react-native-reanimated';
import {
  DEFAULT_SNAP_POINT_BOTTOM,
  DEFAULT_SNAP_POINT_TOP,
  DEFAULT_TIMING_CONFIG,
} from '../constants/animations';

interface Props {
  latestPanValue: Animated.SharedValue<number>;
  isPanGestureAnimationRunning: Animated.SharedValue<number>;
  isCardCollapsed: Animated.SharedValue<number>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

export const getCardOnPressRequest = ({
  latestPanValue,
  translation,
  isPanGestureAnimationRunning,
  isCardCollapsed,
}: Props): void => {
  if (latestPanValue.value === 0) {
    cancelAnimation(translation.y);
    isPanGestureAnimationRunning.value = 1;
    isCardCollapsed.value = isCardCollapsed.value === 1 ? 0 : 1;

    translation.y.value = withSpring(
      isCardCollapsed.value === 0 ? DEFAULT_SNAP_POINT_TOP : DEFAULT_SNAP_POINT_BOTTOM,
      DEFAULT_TIMING_CONFIG,
      () => {
        isPanGestureAnimationRunning.value = 0;
      },
    );
  }
};
