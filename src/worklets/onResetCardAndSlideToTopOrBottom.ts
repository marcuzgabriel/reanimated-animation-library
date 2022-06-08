import Animated, { withSpring } from 'react-native-reanimated';
import { scrollToPosition } from '../helpers';
import type { ContextPropsBottomSheet, BottomSheetConfiguration } from '../types';

type ResetCardAndSlideToTopOrBottomParams = Pick<
  ContextPropsBottomSheet,
  'scrollViewRef' | 'scrollY' | 'translationY'
> &
  Pick<BottomSheetConfiguration, 'snapEffectDirection' | 'springConfig'> & {
    snapPointBottom: number;
    slideDirection: string;
    isAnimationRunning: Animated.SharedValue<boolean>;
    isCardCollapsed: Animated.SharedValue<boolean>;
  };

export const onResetCardAndSlideToTopOrBottom = ({
  snapEffectDirection,
  scrollViewRef,
  scrollY,
  slideDirection,
  springConfig,
  isAnimationRunning,
  isCardCollapsed,
  translationY,
  snapPointBottom,
}: ResetCardAndSlideToTopOrBottomParams): void => {
  'worklet';

  if (snapEffectDirection) {
    snapEffectDirection.value = '';
  }

  if (scrollViewRef.current && scrollY.value > 0) {
    scrollToPosition({ ref: scrollViewRef, to: 'top' });
  }

  isAnimationRunning.value = true;
  isCardCollapsed.value = slideDirection === 'bottom';

  translationY.value = withSpring(
    slideDirection === 'bottom' ? snapPointBottom : 0,
    springConfig,
    isAnimationDone => {
      if (isAnimationDone) {
        isAnimationRunning.value = false;
      }
    },
  );
};
