import React from 'react';
import Animated from 'react-native-reanimated';
import { onResetCardAndSlideToTopOrBottom } from '../onResetCardAndSlideToTopOrBottom';
import { onOpenOrCloseCardRequest } from '../onOpenOrCloseCardRequest';

const mockCloseBottomSheetRequestCallback = jest.fn();

jest.mock('../onResetCardAndSlideToTopOrBottom');
jest.mock('../../helpers/scrollToPosition');

const PARAMS = {
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  scrollY: { value: 0 } as Animated.SharedValue<number>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapEffectDirection: { value: '' } as Animated.SharedValue<string>,
  scrollViewRef: { current: {} } as React.RefObject<Animated.ScrollView>,
  snapPointBottom: 0 as number,
  openBottomSheetRequest: {
    isEnabled: false,
    callback: mockCloseBottomSheetRequestCallback,
  },
  closeBottomSheetRequest: {
    isEnabled: false,
    callback: mockCloseBottomSheetRequestCallback,
  },
};
const CALLBACK_PARAMS = Object.keys(PARAMS).reduce((obj, item, i) => {
  if (!['closeBottomSheetRequest', 'openBottomSheetRequest'].includes(item)) {
    obj[item] = Object.values(PARAMS)[i];
  }

  return obj;
}, {} as any);

const getSlideDirection = (): string => {
  return PARAMS.closeBottomSheetRequest?.isEnabled && !PARAMS.isCardCollapsed.value
    ? 'bottom'
    : 'top';
};

describe('src/worklets/onOpenOrCloseCardRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('closeBottomSheetRequest.isEnabled is true and isCardCollpased.value is false', () => {
    it(`should execute resetCardAndSlideToTopOrBottom with slideDirection set to bottom
    when closeBottomSheetRequest.callback is executed`, () => {
      PARAMS.closeBottomSheetRequest.isEnabled = true;
      PARAMS.isCardCollapsed.value = false;

      const slideDirection = getSlideDirection();

      (PARAMS.closeBottomSheetRequest.callback as jest.Mock).mockImplementation(callback => {
        callback({ ...PARAMS, slideDirection });
      });

      onOpenOrCloseCardRequest(PARAMS);

      expect(onResetCardAndSlideToTopOrBottom).toHaveBeenCalledTimes(1);
      expect(onResetCardAndSlideToTopOrBottom).toHaveBeenCalledWith({
        ...CALLBACK_PARAMS,
        slideDirection: 'bottom',
      });
    });
  });

  describe('openBottomSheetRequest.isEnabled and isCardCollpased.value are both true', () => {
    it(`should execute resetCardAndSlideToTopOrBottom with slideDirection set to top
    when openBottomSheetRequest.callback is executed`, () => {
      PARAMS.openBottomSheetRequest.isEnabled = true;
      PARAMS.isCardCollapsed.value = true;

      const slideDirection = getSlideDirection();

      (PARAMS.openBottomSheetRequest.callback as jest.Mock).mockImplementation(callback =>
        callback({ ...PARAMS, slideDirection }),
      );

      onOpenOrCloseCardRequest(PARAMS);

      expect(onResetCardAndSlideToTopOrBottom).toHaveBeenCalledTimes(1);
      expect(onResetCardAndSlideToTopOrBottom).toHaveBeenCalledWith({
        ...CALLBACK_PARAMS,
        slideDirection: 'top',
      });
    });
  });
});
