import React, { createContext, useContext } from 'react';
import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { KeyboardContext } from '../containers/KeyboardProvider';
import { onIsInputFieldFocusedReaction } from '../worklets';
import type { ContextPropsKeyboardAvoidingView, KeyboardAvoidingViewProviderProps } from '../types';

export const KeyboardAvoidingViewContext = createContext({} as ContextPropsKeyboardAvoidingView);
export const { Provider } = KeyboardAvoidingViewContext;

const KeyboardAvoidingViewProvider: React.FC<KeyboardAvoidingViewProviderProps> = ({
  contentHeight,
  keyboardAvoidBottomMargin,
  translationYValues,
  isFocusInputFieldAnimationRunning,
  isInputFieldFocused,
  isKeyboardAvoidDisabled,
  onIsInputFieldFocusedRequest,
  children,
}) => {
  const inputFields = useSharedValue([]);
  const selectedInputFieldPositionY = useSharedValue(0);

  const { isKeyboardVisible, keyboardHeight, keyboardDuration } = useContext(KeyboardContext);

  useAnimatedReaction(
    () => ({
      isKeyboardVisible,
      keyboardHeight,
      keyboardDuration,
      contentHeight,
    }),
    (result: Record<string, Animated.SharedValue<number | boolean | undefined>>) => {
      if (
        !isKeyboardAvoidDisabled &&
        result?.contentHeight?.value &&
        result.contentHeight.value > 0
      ) {
        return onIsInputFieldFocusedReaction({
          isKeyboardVisible,
          isInputFieldFocused,
          isFocusInputFieldAnimationRunning,
          translationYValues,
          keyboardHeight,
          keyboardDuration,
          onIsInputFieldFocusedRequest,
        });
      }
    },
    [
      isKeyboardVisible,
      selectedInputFieldPositionY,
      isFocusInputFieldAnimationRunning,
      keyboardAvoidBottomMargin,
      contentHeight,
    ],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default KeyboardAvoidingViewProvider;
