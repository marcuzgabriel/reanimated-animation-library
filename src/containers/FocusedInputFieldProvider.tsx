import React, { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { KeyboardContext } from 'containers/KeyboardProvider';
import { onIsInputFieldFocusedReaction } from 'worklets';

export const FocusedInputFieldContext = createContext<Record<string, any>>({});
export const { Provider } = FocusedInputFieldContext;

interface Props {
  translationY: Animated.SharedValue<number>;
  cardHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  cardContentHeight: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  children: React.ReactNode;
}

const FocusedInputFieldProvider: React.FC<Props> = ({
  scrollViewRef,
  translationY,
  isInputFieldFocused,
  cardHeightWhenKeyboardIsVisible,
  cardContentHeight,
  children,
}) => {
  const inputFields = useSharedValue<Record<string, number>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);

  const keyboardContext = useContext(KeyboardContext);
  const windowHeight = useWindowDimensions().height;

  useAnimatedReaction(
    () => ({
      isKeyboardVisible: keyboardContext.isKeyboardVisible,
      keyboardHeight: keyboardContext.keyboardHeight,
      keyboardDuration: keyboardContext.keyboardDuration,
      selectedInputFieldPositionY,
    }),
    (
      result: Record<string, Animated.SharedValue<number>>,
      previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) =>
      onIsInputFieldFocusedReaction({
        result,
        previous,
        windowHeight,
        scrollViewRef,
        translationY,
        isInputFieldFocused,
        cardHeightWhenKeyboardIsVisible,
        cardContentHeight,
      }),
    [keyboardContext.isKeyboardVisible, selectedInputFieldPositionY],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default FocusedInputFieldProvider;
