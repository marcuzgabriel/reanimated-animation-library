import React, { useEffect, createContext, useCallback } from 'react';
import { Platform, Keyboard } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

export const KeyboardContext = createContext<Record<string, any>>({});
export const { Provider } = KeyboardContext;

interface Props {
  children: React.ReactNode;
}

const KeyboardProviderWrapper: React.FC<Props> = ({ children }) => {
  const keyboardProps = React.useState<Record<string, number>>({});

  const isKeyboardVisible = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const keyboardDuration = useSharedValue(0);

  const isIOS = Platform.OS === 'ios';
  const show = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
  const hide = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

  const handleShow = useCallback(
    e => {
      isKeyboardVisible.value = 1;
      keyboardHeight.value = e.endCoordinates.height;
      keyboardDuration.value = e.duration;
    },
    [isKeyboardVisible, keyboardHeight, keyboardDuration],
  );

  const handleHide = useCallback(
    e => {
      isKeyboardVisible.value = 0;
      keyboardHeight.value = 0;
      keyboardDuration.value = e.duration;
    },
    [isKeyboardVisible, keyboardHeight, keyboardDuration],
  );

  useEffect(() => {
    Keyboard.addListener(show, handleShow);
    Keyboard.addListener(hide, handleHide);
    return (): void => {
      Keyboard.removeListener(show, handleShow);
      Keyboard.removeListener(hide, handleHide);
    };
  }, [handleHide, handleShow, show, hide]);

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

export default KeyboardProviderWrapper;
