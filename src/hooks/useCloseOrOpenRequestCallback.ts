import React, { useCallback, useContext, useEffect } from 'react';
import Animated, { withSpring } from 'react-native-reanimated';
import { UserConfigurationContext } from '../containers/UserConfigurationProvider';
import { ReusablePropsContext } from '../containers/ReusablePropsProvider';
import { scrollToPosition } from '../helpers';
import { DEFAULT_SPRING_CONFIG } from '../constants/animations';

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

  const resetSnapEffectDirectionAndScrollCardToTop = useCallback(() => {
    if (snapEffectDirection) {
      snapEffectDirection.value = '';
    }

    if (scrollViewRef?.current && scrollY.value > 0) {
      scrollToPosition({ ref: scrollViewRef, to: 'top' });
    }
  }, [snapEffectDirection, scrollViewRef, scrollY]);

  const getMeasures = useCallback(() => {
    if (!hasCloseOrOpenRequest) return undefined;
    return new Promise((resolve, reject) => {
      if (measureRef && measureRef?.current) {
        measureRef.current.measure(
          (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            if (height > 0) {
              resolve(height);
            }
          },
        );
      } else {
        reject(new Error('measure: animated ref not ready'));
      }
    });
  }, [hasCloseOrOpenRequest, measureRef]);

  useEffect(() => {
    if (!hasCloseOrOpenRequest) return undefined;
    if (isMounted.value) {
      getMeasures()?.then(res => {
        if (typeof res === 'number') {
          const snapPointBottom =
            res > 0 ? res - configSnapPointBottom - (extraSnapPointBottomOffset ?? 0) : 0;

          if (closeBottomSheetRequest?.isEnabled && !isCardCollapsed.value) {
            closeBottomSheetRequest?.callback(() => {
              resetSnapEffectDirectionAndScrollCardToTop();
              isAnimationRunning.value = true;
              translationY.value = withSpring(
                snapPointBottom,
                DEFAULT_SPRING_CONFIG,
                isAnimationDone => {
                  if (isAnimationDone) {
                    isAnimationRunning.value = false;
                  }
                },
              );
              isCardCollapsed.value = true;
            });
          } else if (openBottomSheetRequest?.isEnabled && isCardCollapsed.value) {
            openBottomSheetRequest?.callback(() => {
              resetSnapEffectDirectionAndScrollCardToTop();
              translationY.value = withSpring(0, DEFAULT_SPRING_CONFIG, isAnimationDone => {
                if (isAnimationDone) {
                  isAnimationRunning.value = false;
                }
              });
              isCardCollapsed.value = false;
            });
          }
        }
      });
    }
  }, [
    isMounted,
    isCardCollapsed,
    isAnimationRunning,
    hasCloseOrOpenRequest,
    configSnapPointBottom,
    extraSnapPointBottomOffset,
    scrollY,
    scrollViewRef,
    snapEffectDirection,
    translationY,
    getMeasures,
    resetSnapEffectDirectionAndScrollCardToTop,
    closeBottomSheetRequest,
    openBottomSheetRequest,
  ]);
};
