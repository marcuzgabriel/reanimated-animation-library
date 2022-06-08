import Animated from 'react-native-reanimated';
import { onResetCardAndSlideToTopOrBottom } from './onResetCardAndSlideToTopOrBottom';
import type { ContextPropsBottomSheet, BottomSheetConfiguration } from '../types';

type UnionContextPropsBottomSheetTypes = 'scrollViewRef' | 'scrollY' | 'translationY';
type UnionBottomSheetConfigurationTypes =
  | 'snapEffectDirection'
  | 'springConfig'
  | 'closeBottomSheetRequest'
  | 'openBottomSheetRequest';

type OnOpenOrCloseCardRequestParams = Pick<
  ContextPropsBottomSheet,
  UnionContextPropsBottomSheetTypes
> &
  Pick<BottomSheetConfiguration, UnionBottomSheetConfigurationTypes> & {
    snapPointBottom: number;
    isAnimationRunning: Animated.SharedValue<boolean>;
    isCardCollapsed: Animated.SharedValue<boolean>;
  };

export const onOpenOrCloseCardRequest = ({
  closeBottomSheetRequest,
  openBottomSheetRequest,
  isCardCollapsed,
  ...rest
}: OnOpenOrCloseCardRequestParams): void => {
  'worklet';

  if (closeBottomSheetRequest?.isEnabled && !isCardCollapsed.value) {
    closeBottomSheetRequest.callback(() => {
      onResetCardAndSlideToTopOrBottom({
        ...rest,
        isCardCollapsed,
        slideDirection: 'bottom',
      });
    });
  } else if (openBottomSheetRequest?.isEnabled && isCardCollapsed.value) {
    openBottomSheetRequest.callback(() => {
      onResetCardAndSlideToTopOrBottom({
        ...rest,
        isCardCollapsed,
        slideDirection: 'top',
      });
    });
  }
};
