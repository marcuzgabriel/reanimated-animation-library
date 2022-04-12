import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SPRING_CONFIG, DEFAULT_SPRING_VALUE_OUTCOME } from '../constants/animations';

interface OnRenderSmoothTransitionParams {
  headerHeight: Animated.SharedValue<number>;
  contentHeight: Animated.SharedValue<number>;
  smoothAppearanceClock: Animated.SharedValue<number>;
  isSmoothAppearanceAnimationRunning: Animated.SharedValue<boolean>;
  shouldWaitForContent?: boolean;
}

export const onRenderSmoothAppearance = ({
  headerHeight,
  contentHeight,
  isSmoothAppearanceAnimationRunning,
  smoothAppearanceClock,
  shouldWaitForContent,
}: OnRenderSmoothTransitionParams): void => {
  'worklet';

  const areMeasuresCalculated = shouldWaitForContent
    ? headerHeight.value > 0 && contentHeight.value > 0
    : headerHeight.value > 0;

  if (areMeasuresCalculated && !isSmoothAppearanceAnimationRunning.value) {
    if (smoothAppearanceClock.value > 0) {
      smoothAppearanceClock.value = 0;
    }

    isSmoothAppearanceAnimationRunning.value = true;

    smoothAppearanceClock.value = withSpring(
      DEFAULT_SPRING_VALUE_OUTCOME,
      DEFAULT_SPRING_CONFIG,
      isAnimationDone => {
        if (isAnimationDone) {
          isSmoothAppearanceAnimationRunning.value = false;
        }
      },
    );
  }
};
