import React, { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { KeyboardContext } from 'containers/KeyboardProvider';
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP } from 'constants/styles';
import { onIsInputFieldFocusedReaction } from 'worklets';

export const FocusedInputFieldContext = createContext<Record<string, any>>({});
export const { Provider } = FocusedInputFieldContext;

interface Props {
  translationY: Animated.SharedValue<number>;
  footerTranslationY: Animated.SharedValue<number>;
  cardHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  cardContentHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  children: React.ReactNode;
}

const FocusedInputFieldProvider: React.FC<Props> = ({
  scrollViewRef,
  translationY,
  footerTranslationY,
  isInputFieldFocused,
  cardHeightWhenKeyboardIsVisible,
  cardContentHeight,
  headerHeight,
  footerHeight,
  children,
}) => {
  const inputFields = useSharedValue<Record<string, any>>([]);
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
        footerTranslationY,
        isInputFieldFocused,
        cardHeightWhenKeyboardIsVisible,
        cardContentHeight,
        headerHeight,
        footerHeight,
      }),
    [keyboardContext.isKeyboardVisible, selectedInputFieldPositionY],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default FocusedInputFieldProvider;
