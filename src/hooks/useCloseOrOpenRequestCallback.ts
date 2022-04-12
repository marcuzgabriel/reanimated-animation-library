import React, { useContext, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { UserConfigurationContext } from '../containers/UserConfigurationProvider';
import { ReusablePropsContext } from '../containers/ReusablePropsProvider';
import { getAnimatedMeasures } from '../helpers';
import { onOpenOrCloseCardRequest } from '../worklets';

interface UseCloseOrOpenRequestCallbackProps {
  measureRef: React.RefObject<Animated.View> | any;
  isMounted: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  hasCloseOrOpenRequest?: boolean;
}

export const useCloseOrOpenRequestCallback = ({
  hasCloseOrOpenRequest,
  measureRef,
  isMounted,
  isCardCollapsed,
  isAnimationRunning,
}: UseCloseOrOpenRequestCallbackProps): void => {
  const {
    snapPointBottom: configSnapPointBottom,
    extraSnapPointBottomOffset,
    snapEffectDirection,
    openBottomSheetRequest,
    closeBottomSheetRequest,
  } = useContext(UserConfigurationContext);

  const { scrollViewRef, scrollY, translationY } = useContext(ReusablePropsContext.bottomSheet);

  useEffect(() => {
    if (!hasCloseOrOpenRequest) {
      return undefined;
    }

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
  }, [
    isMounted,
    measureRef,
    isCardCollapsed,
    isAnimationRunning,
    hasCloseOrOpenRequest,
    configSnapPointBottom,
    extraSnapPointBottomOffset,
    scrollY,
    scrollViewRef,
    snapEffectDirection,
    translationY,
    closeBottomSheetRequest,
    openBottomSheetRequest,
  ]);
};
