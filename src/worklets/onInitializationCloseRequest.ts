import Animated, { withSpring } from 'react-native-reanimated';
import { DEFAULT_SPRING_CONFIG } from '../constants/animations';
import type { BottomSheetConfiguration, ContextPropsBottomSheet } from '../types';

interface OnInitializationCloseRequestProps
  extends Pick<BottomSheetConfiguration, 'snapEffectDirection'>,
    Pick<ContextPropsBottomSheet, 'translationY'> {
  isInitializedAsClosed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  snapPointBottom: Animated.SharedValue<number>;
}

export const onInitializationCloseRequest = ({
  isCardCollapsed,
  isInitializedAsClosed,
  isAnimationRunning,
  snapEffectDirection,
  translationY,
  snapPointBottom,
}: OnInitializationCloseRequestProps): void => {
  'worklet';

  isCardCollapsed.value = true;

  if (snapEffectDirection) {
    snapEffectDirection.value = '';
  }

  if (snapPointBottom.value > 0 && translationY.value !== snapPointBottom.value) {
    isAnimationRunning.value = true;
    translationY.value = withSpring(
      snapPointBottom.value,
      DEFAULT_SPRING_CONFIG,
      isAnimationDone => {
        if (isAnimationDone) {
          isInitializedAsClosed.value = true;
          isAnimationRunning.value = false;
        }
      },
    );
  }
};
