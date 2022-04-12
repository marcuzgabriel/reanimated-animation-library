import Animated, { useSharedValue } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { onIsInputFieldFocusedReaction } from '../onIsInputFieldFocusedReaction';
import { renderHook } from '@testing-library/react-hooks';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  isFocusInputFieldAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  isInputFieldFocused: { value: false } as Animated.SharedValue<boolean>,
  translationYValues: [{ value: 0 }] as Animated.SharedValue<number>[],
  isKeyboardVisible: { value: false } as Animated.SharedValue<boolean | undefined>,
  keyboardDuration: { value: 0 } as Animated.SharedValue<number>,
  keyboardHeight: { value: 0 } as Animated.SharedValue<number>,
};

const mockOnIsInputFieldFocusedRequest = jest.fn();

describe('src/worklets/onIsInputFieldFocusedReaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isKeyboardVisible.value defined', () => {
    beforeEach(() => {
      PARAMS.isKeyboardVisible.value = true;
    });

    describe('platform is ios', () => {
      beforeEach(() => {
        Platform.OS = 'ios';
      });

      it('should update isFocusedInputFieldAnimationRunning.value to true', () => {
        renderHook(() => {
          PARAMS.isFocusInputFieldAnimationRunning = useSharedValue(false);
        });

        onIsInputFieldFocusedReaction(PARAMS);

        expect(PARAMS.isFocusInputFieldAnimationRunning.value).toBeTruthy();
      });

      it('should animate and update all translationYValues so they are positioned above the keyboard', () => {
        withReanimatedTimer(() => {
          renderHook(() => {
            PARAMS.keyboardDuration = useSharedValue(250);
            PARAMS.keyboardHeight = useSharedValue(250);
            PARAMS.isFocusInputFieldAnimationRunning = useSharedValue(false);
            PARAMS.translationYValues = [useSharedValue(100), useSharedValue(200)];
          });

          onIsInputFieldFocusedReaction(PARAMS);

          expect(PARAMS.isFocusInputFieldAnimationRunning.value).toBeTruthy();

          advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

          expect(PARAMS.isFocusInputFieldAnimationRunning.value).toBeFalsy();
          expect(PARAMS.translationYValues[0].value).toBe(-PARAMS.keyboardHeight.value);
          expect(PARAMS.translationYValues[1].value).toBe(-PARAMS.keyboardHeight.value);
        });
      });
    });

    describe('platform is any', () => {
      beforeEach(() => {
        Platform.OS = 'android';
      });

      it('should execute onIsInputFieldFocusedRequest if it is provided', () => {
        onIsInputFieldFocusedReaction({
          ...PARAMS,
          onIsInputFieldFocusedRequest: mockOnIsInputFieldFocusedRequest,
        });

        expect(mockOnIsInputFieldFocusedRequest).toHaveBeenCalledTimes(1);
        expect(mockOnIsInputFieldFocusedRequest).toHaveBeenCalledWith(false, 0);
      });

      it('should not execute onIsInputFieldFocusedRequest if it is not provided', () => {
        onIsInputFieldFocusedReaction(PARAMS);

        expect(mockOnIsInputFieldFocusedRequest).not.toHaveBeenCalled();
      });

      it('should update isInputFieldFocused.value to isKeyboardVisible.value', () => {
        renderHook(() => {
          PARAMS.isInputFieldFocused = useSharedValue(false);
          PARAMS.isKeyboardVisible = useSharedValue(true);
        });

        onIsInputFieldFocusedReaction(PARAMS);

        expect(PARAMS.isInputFieldFocused).toBeTruthy();
      });
    });
  });

  describe('isKeyboardVisible.value undefined', () => {
    beforeEach(() => {
      PARAMS.isKeyboardVisible.value = undefined;
      PARAMS.isInputFieldFocused.value = true;
    });

    it('should update isInputFieldFocused.value to false', () => {
      onIsInputFieldFocusedReaction(PARAMS);

      expect(PARAMS.isInputFieldFocused.value).toBeFalsy();
    });
  });
});
