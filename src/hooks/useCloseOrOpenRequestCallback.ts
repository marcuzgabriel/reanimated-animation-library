import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { getAnimatedMeasures } from '../helpers';
import { onOpenOrCloseCardRequest } from '../worklets';
import type { BottomSheetConfiguration, ContextPropsBottomSheet } from '../types';

interface UseCloseOrOpenRequestCallbackParams
  extends Pick<
      BottomSheetConfiguration,
      | 'extraSnapPointBottomOffset'
      | 'springConfig'
      | 'snapPointBottom'
      | 'snapEffectDirection'
      | 'openBottomSheetRequest'
      | 'closeBottomSheetRequest'
    >,
    Pick<ContextPropsBottomSheet, 'scrollViewRef' | 'scrollY' | 'translationY'> {
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
  snapPointBottom,
  extraSnapPointBottomOffset,
  snapEffectDirection,
  springConfig,
  openBottomSheetRequest,
  closeBottomSheetRequest,
  scrollViewRef,
  scrollY,
  translationY,
}: UseCloseOrOpenRequestCallbackParams): void => {
  useEffect(() => {
    if (!hasCloseOrOpenRequest) {
      return undefined;
    }

    if (isMounted.value && measureRef?.current) {
      getAnimatedMeasures({
        ref: measureRef,
        callback: ({ height }) => {
          const derivedSnapPointBottom =
            height > 0 ? height - snapPointBottom - (extraSnapPointBottomOffset ?? 0) : 0;

          onOpenOrCloseCardRequest({
            closeBottomSheetRequest,
            openBottomSheetRequest,
            isCardCollapsed,
            snapEffectDirection,
            scrollViewRef,
            scrollY,
            springConfig,
            isAnimationRunning,
            translationY,
            snapPointBottom: derivedSnapPointBottom,
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
    extraSnapPointBottomOffset,
    scrollY,
    scrollViewRef,
    snapEffectDirection,
    translationY,
    closeBottomSheetRequest,
    openBottomSheetRequest,
    snapPointBottom,
    springConfig,
  ]);
};
