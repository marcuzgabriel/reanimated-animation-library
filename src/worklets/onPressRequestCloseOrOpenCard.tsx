import Animated, { cancelAnimation, withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, DEFAULT_TIMING_CONFIG } from 'constants/animations';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  derivedIsCollapsed: Animated.SharedValue<boolean>;
  derivedIsPanning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
}

export const onPressRequestCloseOrOpenCard = ({
  translationY,
  isAnimationRunning,
  derivedIsCollapsed,
  derivedIsPanning,
  snapPointBottom,
  isCardCollapsed,
}: Props): void => {
  'worklet';

  if (!derivedIsPanning.value) {
    cancelAnimation(translationY);
    isAnimationRunning.value = true;
    isCardCollapsed.value = !isCardCollapsed.value;

    translationY.value = withSpring(
      derivedIsCollapsed.value ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      DEFAULT_TIMING_CONFIG,
      () => {
        isAnimationRunning.value = false;
      },
    );
  }
};
