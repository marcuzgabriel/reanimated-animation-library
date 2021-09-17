import React, { useEffect, createContext, useCallback } from 'react';
import { Platform, Keyboard } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { ContextPropsKeyboard } from '../types';

export const KeyboardContext = createContext({} as ContextPropsKeyboard);
export const { Provider } = KeyboardContext;

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

interface Props {
  children: React.ReactNode;
}

const KeyboardProvider: React.FC<Props> = ({ children }) => {
  const isKeyboardVisible = useSharedValue<boolean | undefined>(undefined);
  const keyboardHeight = useSharedValue(0);
  const keyboardDuration = useSharedValue(0);

  const show = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';

  const handleShow = useCallback(
    e => {
      isKeyboardVisible.value = true;
      keyboardHeight.value = e.endCoordinates.height;
      keyboardDuration.value = e.duration;
    },
    [isKeyboardVisible, keyboardHeight, keyboardDuration],
  );

  const handleHide = useCallback(
    e => {
      isKeyboardVisible.value = false;
      keyboardHeight.value = 0;
      keyboardDuration.value = e.duration;
    },
    [isKeyboardVisible, keyboardHeight, keyboardDuration],
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener(show, handleShow);
    const willHideSubscription = Keyboard.addListener('keyboardWillHide', handleHide);
    const didHideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      if (isAndroid) {
        handleShow(e);
      }

      isKeyboardVisible.value = undefined;
    });

    return (): void => {
      showSubscription.remove();
      willHideSubscription.remove();
      didHideSubscription.remove();
    };
  }, [handleHide, handleShow, show, isKeyboardVisible]);

  return (
    <Provider
      value={{
        isKeyboardVisible,
        keyboardHeight,
        keyboardDuration,
      }}
    >
      {children}
    </Provider>
  );
};

export default KeyboardProvider;
