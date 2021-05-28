import React, { useMemo, createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
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
  scrollViewRef?: React.RefObject<Animated.ScrollView> | any;
  scrollViewHeight?: Animated.SharedValue<number>;
  contentHeight?: Animated.SharedValue<number>;
  contentHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  disableScrollAnimation?: boolean;
  keyboardAvoidBottomMargin?: number;
  translationY?: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isKeyboardAvoidDisabled?: boolean;
  contextName?: string;
  children: React.ReactNode;
}
interface AnimatedReaction {
  contentHeight?: Animated.SharedValue<number>;
  isKeyboardVisible: Animated.SharedValue<boolean>;
  keyboardHeight: Animated.SharedValue<number>;
  keyboardDuration: Animated.SharedValue<number>;
  selectedInputFieldPositionY: Animated.SharedValue<number>;
}

const KeyboardAvoidingViewProvider: React.FC<Props> = ({
  contentHeight: defaultContentHeight,
  translationY: defaultTranslationY,
  contentHeightWhenKeyboardIsVisible,
  disableScrollAnimation,
  keyboardAvoidBottomMargin,
  isInputFieldFocused,
  isKeyboardAvoidDisabled,
  scrollViewRef,
  scrollViewHeight,
  contextName,
  children,
}) => {
  const inputFields = useSharedValue<Record<string, any>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);
  const windowHeight = useWindowDimensions().height;

  const { isKeyboardVisible, keyboardHeight, keyboardDuration } = useContext(KeyboardContext);
  const {
    scrollViewRef: bottomSheetScrollViewRef,
    contentHeight: bottomSheetContentHeight,
    translationY: bottomSheetTranslationY,
    footerTranslationY,
    headerHeight,
    footerHeight,
  } = useContext(ReusablePropsContext.bottomSheet);

  const isTypeBottomSheet = useMemo(() => contextName === 'bottomSheet', [contextName]);
  const contentHeight = useMemo(
    () => (isTypeBottomSheet ? bottomSheetContentHeight : defaultContentHeight),
    [isTypeBottomSheet, bottomSheetContentHeight, defaultContentHeight],
  );
  const translationY = useMemo(
    () => (isTypeBottomSheet ? bottomSheetTranslationY : defaultTranslationY),
    [isTypeBottomSheet, bottomSheetTranslationY, defaultTranslationY],
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
      if (!isKeyboardAvoidDisabled) {
        if (!isTypeBottomSheet && result?.contentHeight && result.contentHeight.value > 0) {
          return onIsInputFieldFocusedReaction({
            result,
            previous,
            windowHeight,
            contentHeight: result.contentHeight,
            contentHeightWhenKeyboardIsVisible,
            disableScrollAnimation,
            keyboardAvoidBottomMargin,
            translationY,
            scrollViewRef,
            scrollViewHeight,
          });
        } else if (isTypeBottomSheet) {
          return onIsInputFieldFocusedReactionBottomSheet({
            result,
            previous,
            windowHeight,
            scrollViewRef: bottomSheetScrollViewRef,
            contentHeight: bottomSheetContentHeight,
            translationY,
            footerTranslationY,
            isInputFieldFocused,
            contentHeightWhenKeyboardIsVisible,
            headerHeight,
            footerHeight,
          });
        }
      }
    },
    [isKeyboardVisible, selectedInputFieldPositionY, contentHeight],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default KeyboardAvoidingViewProvider;
