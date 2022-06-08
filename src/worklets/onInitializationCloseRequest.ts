import Animated, { withSpring } from 'react-native-reanimated';
import type { BottomSheetConfiguration, ContextPropsBottomSheet } from '../types';

interface OnInitializationCloseRequestProps
  extends Pick<BottomSheetConfiguration, 'snapEffectDirection'>,
    Pick<ContextPropsBottomSheet, 'translationY'> {
  isInitializedAsClosed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  snapPointBottom: Animated.SharedValue<number>;
  springConfig: BottomSheetConfiguration['springConfig'];
}

export const onInitializationCloseRequest = ({
  isCardCollapsed,
  isInitializedAsClosed,
  isAnimationRunning,
  snapEffectDirection,
  translationY,
  snapPointBottom,
  springConfig,
}: OnInitializationCloseRequestProps): void => {
  'worklet';

  isCardCollapsed.value = true;

  if (snapEffectDirection) {
    snapEffectDirection.value = '';
  }

  if (snapPointBottom.value > 0 && translationY.value !== snapPointBottom.value) {
    isAnimationRunning.value = true;
    translationY.value = withSpring(snapPointBottom.value, springConfig, isAnimationDone => {
      if (isAnimationDone) {
        isInitializedAsClosed.value = true;
        isAnimationRunning.value = false;
      }
    });
  }
};
