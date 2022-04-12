import Animated, { withTiming, runOnJS } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { KEYBOARD_TIMING_EASING } from '../constants/animations';
import type { ContextPropsKeyboard, ScrollViewProps } from '../types';

const isIOS = Platform.OS === 'ios';

interface OnIsInputFieldFocusedReactionProps
  extends Pick<ScrollViewProps, 'translationYValues' | 'onIsInputFieldFocusedRequest'>,
    Pick<ContextPropsKeyboard, 'isKeyboardVisible'> {
  keyboardHeight: Animated.SharedValue<number>;
  keyboardDuration: Animated.SharedValue<number>;
  isFocusInputFieldAnimationRunning: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
}

export const onIsInputFieldFocusedReaction = ({
  isFocusInputFieldAnimationRunning,
  isInputFieldFocused,
  translationYValues,
  isKeyboardVisible,
  keyboardDuration,
  keyboardHeight,
  onIsInputFieldFocusedRequest,
}: OnIsInputFieldFocusedReactionProps): void => {
  'worklet';

  if (typeof isKeyboardVisible?.value === 'boolean') {
    if (isIOS) {
      const animationTimingConfig = {
        duration: keyboardDuration.value,
        KEYBOARD_TIMING_EASING,
      };

      isFocusInputFieldAnimationRunning.value = true;

      translationYValues?.forEach(translationValue => {
        if (translationValue.value !== -keyboardHeight.value) {
          translationValue.value = withTiming(
            -keyboardHeight.value,
            animationTimingConfig,
            isAnimationDone => {
              if (isAnimationDone) {
                isFocusInputFieldAnimationRunning.value = false;
              }
            },
          );
        }
      });
    }

    if (typeof onIsInputFieldFocusedRequest === 'function') {
      runOnJS(onIsInputFieldFocusedRequest)(false, 0);
    }

    isInputFieldFocused.value = isKeyboardVisible.value;
  } else if (isInputFieldFocused.value) {
    isInputFieldFocused.value = false;
  }
};
