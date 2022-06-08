import Animated, { cancelAnimation, withSpring } from 'react-native-reanimated';
import { DEFAULT_SNAP_POINT_TOP, SPRING_OFFSET } from '../constants/animations';
import type { BottomSheetConfiguration } from '../types';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  springConfig: BottomSheetConfiguration['springConfig'];
  direction?: string | undefined;
}

export const onActionRequestCloseOrOpenCard = ({
  translationY,
  isAnimationRunning,
  snapPointBottom,
  springConfig,
  isCardCollapsed,
  direction,
}: Props): void => {
  'worklet';
  cancelAnimation(translationY);
  isAnimationRunning.value = true;

  const isSnapping = direction === 'up' || direction === 'down';
  isCardCollapsed.value = direction === 'up' || translationY.value <= SPRING_OFFSET;

  if (isSnapping) {
    translationY.value = withSpring(
      direction === 'up' ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      springConfig,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = false;
        }
      },
    );
  } else {
    translationY.value = withSpring(
      translationY.value <= SPRING_OFFSET ? snapPointBottom.value : DEFAULT_SNAP_POINT_TOP,
      springConfig,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = false;
        }
      },
    );
  }
};
