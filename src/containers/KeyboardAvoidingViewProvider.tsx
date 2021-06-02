import React, { useMemo, createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { KeyboardContext } from '../containers/KeyboardProvider';
import { ReusablePropsContext } from '../containers/ReusablePropsProvider';
import {
  onIsInputFieldFocusedReactionBottomSheet,
  onIsInputFieldFocusedReaction,
} from '../worklets';
import { UserConfigurationContext } from './UserConfigurationProvider';

const isIOS = Platform.OS === 'ios';

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
  onIsInputFieldFocusedRequest?: (status: boolean, availableHeight: number) => void;
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
  scrollViewRef: defaultScrollViewRef,
  scrollViewHeight: defaultScrollViewHeight,
  keyboardAvoidBottomMargin: defaultKeyboardAvoidBottomMargin,
  onIsInputFieldFocusedRequest: defaultOnIsInputFieldFocusedRequest,
  contentHeightWhenKeyboardIsVisible,
  disableScrollAnimation,
  isInputFieldFocused,
  isKeyboardAvoidDisabled,
  contextName,
  children,
}) => {
  const inputFields = useSharedValue<Record<string, any>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);
  const windowHeight = useWindowDimensions().height;

  const { isKeyboardVisible, keyboardHeight, keyboardDuration } = useContext(KeyboardContext);
  const { keyboardAvoidBottomMargin: bottomSheetKeyboardAvoidBottomMargin } =
    useContext(UserConfigurationContext);

  const {
    scrollViewRef: bottomSheetScrollViewRef,
    scrollViewHeight: bottomSheetScrollViewHeight,
    contentHeight: bottomSheetContentHeight,
    translationY: bottomSheetTranslationY,
    onIsInputFieldFocusedRequest: bottomSheetOnIsInputFieldFocusedRequest,
    footerTranslationY,
    headerHeight,
    footerHeight,
  } = useContext(ReusablePropsContext.bottomSheet);

  const isContextNameBottomSheet = useMemo(() => contextName === 'bottomSheet', [contextName]);
  const onIsInputFieldFocusedRequest = useMemo(
    () =>
      contextName === 'bottomSheet'
        ? bottomSheetOnIsInputFieldFocusedRequest
        : defaultOnIsInputFieldFocusedRequest,
    [contextName, bottomSheetOnIsInputFieldFocusedRequest, defaultOnIsInputFieldFocusedRequest],
  );
  const scrollViewRef = useMemo(
    () => (isContextNameBottomSheet ? bottomSheetScrollViewRef : defaultScrollViewRef),
    [isContextNameBottomSheet, bottomSheetScrollViewRef, defaultScrollViewRef],
  );
  const keyboardAvoidBottomMargin = useMemo(
    () =>
      isContextNameBottomSheet
        ? bottomSheetKeyboardAvoidBottomMargin
        : defaultKeyboardAvoidBottomMargin,
    [
      isContextNameBottomSheet,
      bottomSheetKeyboardAvoidBottomMargin,
      defaultKeyboardAvoidBottomMargin,
    ],
  );
  const contentHeight = useMemo(
    () => (isContextNameBottomSheet ? bottomSheetContentHeight : defaultContentHeight),
    [isContextNameBottomSheet, bottomSheetContentHeight, defaultContentHeight],
  );
  const translationY = useMemo(
    () => (isContextNameBottomSheet ? bottomSheetTranslationY : defaultTranslationY),
    [isContextNameBottomSheet, bottomSheetTranslationY, defaultTranslationY],
  );
  const scrollViewHeight = useMemo(
    () => (isContextNameBottomSheet ? bottomSheetScrollViewHeight : defaultScrollViewHeight),
    [isContextNameBottomSheet, bottomSheetScrollViewHeight, defaultScrollViewHeight],
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
        if (!isContextNameBottomSheet && result?.contentHeight && result.contentHeight.value > 0) {
          return onIsInputFieldFocusedReaction({
            result,
            previous,
            windowHeight,
            contentHeight: result.contentHeight,
            contentHeightWhenKeyboardIsVisible,
            disableScrollAnimation,
            keyboardAvoidBottomMargin,
            isInputFieldFocused,
            translationY,
            scrollViewRef,
            scrollViewHeight,
            onIsInputFieldFocusedRequest,
          });
        } else if (isContextNameBottomSheet) {
          return onIsInputFieldFocusedReactionBottomSheet({
            result,
            previous,
            windowHeight,
            scrollViewRef,
            scrollViewHeight,
            contentHeight: bottomSheetContentHeight,
            keyboardAvoidBottomMargin,
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
    [isKeyboardVisible, selectedInputFieldPositionY, keyboardAvoidBottomMargin, contentHeight],
  );

  return <Provider value={{ inputFields, selectedInputFieldPositionY }}>{children}</Provider>;
};

export default KeyboardAvoidingViewProvider;
