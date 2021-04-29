import Animated, { cancelAnimation, withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_TIMING_CONFIG } from '../constants/animations';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  derivedIsCollapsed: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

export const onPressRequestCloseOrOpenCard = ({
  translation,
  isAnimationRunning,
  derivedIsCollapsed,
  snapPointBottom,
  isCardCollapsed,
}: Props): void => {
  'worklet';

  cancelAnimation(translation.y);
  isAnimationRunning.value = true;
  isCardCollapsed.value = !isCardCollapsed.value;

  translation.y.value = withSpring(
    derivedIsCollapsed.value ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
    DEFAULT_TIMING_CONFIG,
    () => {
      isAnimationRunning.value = false;
    },
  );
};
