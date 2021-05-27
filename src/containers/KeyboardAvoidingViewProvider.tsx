import React, { useMemo, createContext, useContext } from 'react';
import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { KeyboardContext } from '../containers/KeyboardProvider';
import { ReusablePropsContext } from '../containers/ReusablePropsProvider';
import {
  onIsInputFieldFocusedReactionBottomSheet,
  onIsInputFieldFocusedReaction,
} from '../worklets';

export const KeyboardAvoidingViewContext = createContext<Record<string, any>>({});
export const { Provider } = KeyboardAvoidingViewContext;

interface Props {
  cardHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  type?: string;
  children: React.ReactNode;
}

const KeyboardAvoidingViewProvider: React.FC<Props> = ({
  isInputFieldFocused,
  cardHeightWhenKeyboardIsVisible,
  type,
  children,
}) => {
  const inputFields = useSharedValue<Record<string, any>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);
  const isTypeBottomSheet = useMemo(() => type === 'bottomSheet', [type]);

  const { isKeyboardVisible, keyboardHeight, keyboardDuration } = useContext(KeyboardContext);
  const {
    windowHeight,
    scrollViewRef,
    translationY,
    footerTranslationY,
    cardContentHeight,
    headerHeight,
    footerHeight,
  } = useContext(ReusablePropsContext);

  useAnimatedReaction(
    () => ({
      isKeyboardVisible,
      keyboardHeight,
      keyboardDuration,
      selectedInputFieldPositionY,
    }),
    (
      result: Record<string, Animated.SharedValue<number>>,
      previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) =>
      isTypeBottomSheet
        ? onIsInputFieldFocusedReactionBottomSheet({
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
          })
        : onIsInputFieldFocusedReaction(),
    [isKeyboardVisible, selectedInputFieldPositionY],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default KeyboardAvoidingViewProvider;
