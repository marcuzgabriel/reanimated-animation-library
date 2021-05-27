import React, { useMemo, createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { KeyboardContext } from '../containers/KeyboardProvider';
import { ReusablePropsContext } from '../containers/ReusablePropsProvider';
import {
  onIsInputFieldFocusedReactionBottomSheet,
  onIsInputFieldFocusedReaction,
} from '../worklets';

export const KeyboardAvoidingViewContext = createContext<Record<string, any>>({});
export const { Provider } = KeyboardAvoidingViewContext;

interface Props {
  contentHeight?: Animated.SharedValue<number>;
  cardHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  type?: string;
  children: React.ReactNode;
}
interface AnimatedReaction {
  contentHeight?: Animated.SharedValue<number> | undefined;
  isKeyboardVisible: Animated.SharedValue<boolean>;
  keyboardHeight: Animated.SharedValue<number>;
  keyboardDuration: Animated.SharedValue<number>;
  selectedInputFieldPositionY: Animated.SharedValue<number>;
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
  const windowHeight = useWindowDimensions().height;

  const { isKeyboardVisible, keyboardHeight, keyboardDuration } = useContext(KeyboardContext);
  const {
    scrollViewRef: bottomSheetScrollViewRef,
    translationY,
    footerTranslationY,
    cardContentHeight,
    headerHeight,
    footerHeight,
  } = useContext(ReusablePropsContext.bottomSheet);

  const { scrollViewRef: scrollViewKeyboardAvoidScrollViewRef, contentHeight } = useContext(
    ReusablePropsContext.scrollViewKeyboardAvoid,
  );

  useAnimatedReaction(
    () => ({
      isKeyboardVisible,
      keyboardHeight,
      keyboardDuration,
      selectedInputFieldPositionY,
      contentHeight,
    }),
    (result: AnimatedReaction, previous: AnimatedReaction | null | undefined) => {
      if (!isTypeBottomSheet && result?.contentHeight && result.contentHeight.value > 0) {
        return onIsInputFieldFocusedReaction({
          result,
          previous,
          windowHeight,
          contentHeight: result.contentHeight,
          scrollViewRef: scrollViewKeyboardAvoidScrollViewRef,
        });
      } else if (isTypeBottomSheet) {
        return onIsInputFieldFocusedReactionBottomSheet({
          result,
          previous,
          windowHeight,
          scrollViewRef: bottomSheetScrollViewRef,
          translationY,
          footerTranslationY,
          isInputFieldFocused,
          cardHeightWhenKeyboardIsVisible,
          cardContentHeight,
          headerHeight,
          footerHeight,
        });
      }
    },
    [isKeyboardVisible, selectedInputFieldPositionY, contentHeight],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default KeyboardAvoidingViewProvider;
