import React from 'react';
import Animated, { useAnimatedRef, useSharedValue } from 'react-native-reanimated';

import { getAnimatedMeasures } from '../helpers';

const InputAnimationWrapper: React.FC = () => {
  const inputRef = useAnimatedRef<Animated.View>();
  const positionY = useSharedValue(0);
  const translationY = useSharedValue(0);

  /* TODO:
  - Ensure that translation Y is right above keyboard.
    The value is probably coming from the outside
  - Add flexibility to input position



  if (isMounted.value && measureRef?.current) {
    getAnimatedMeasures({
      ref: measureRef,
      callback: ({ height }) => {
        const snapPointBottom =
          height > 0 ? height - configSnapPointBottom - (extraSnapPointBottomOffset ?? 0) : 0;

        onOpenOrCloseCardRequest({
          closeBottomSheetRequest,
          openBottomSheetRequest,
          isCardCollapsed,
          snapEffectDirection,
          scrollViewRef,
          scrollY,
          isAnimationRunning,
          translationY,
          snapPointBottom,
        });
      },
    });

}
*/
};
