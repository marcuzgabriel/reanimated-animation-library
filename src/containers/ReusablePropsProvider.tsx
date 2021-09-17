import React, { createContext } from 'react';
import Animated, { useSharedValue, useAnimatedRef } from 'react-native-reanimated';
import { ContextPropsBottomSheet, ContextPropsScrollViewKeyboardAvoid } from '../types';

export const ReusablePropsContext = {
  bottomSheet: createContext({} as ContextPropsBottomSheet),
  scrollViewKeyboardAvoid: createContext({} as ContextPropsScrollViewKeyboardAvoid),
};

export const { Provider: BottomSheetProvider } = ReusablePropsContext.bottomSheet;
export const { Provider: ScrollViewKeyboardAvoidProvider } =
  ReusablePropsContext.scrollViewKeyboardAvoid;

interface Props {
  contextName: string;
  children: React.ReactNode;
}

const ReusablePropsProvider: React.FC<Props> = ({ contextName, children }) => {
  const bottomSheet = {
    headerHeight: useSharedValue(0),
    footerHeight: useSharedValue(0),
    contentHeight: useSharedValue(0),
    cardHeight: useSharedValue(0),
    hideFooterInterpolation: useSharedValue(0),
    scrollViewRef: useAnimatedRef<Animated.ScrollView>(),
    scrollViewHeight: useSharedValue(0),
    scrollViewWidth: useSharedValue(0),
    scrollingLength: useSharedValue(0),
    translationY: useSharedValue(0),
    footerTranslationY: useSharedValue(0),
    scrollY: useSharedValue(0),
    isScrollable: useSharedValue(false),
    isScrolledToTop: useSharedValue(false),
    isScrolledToEnd: useSharedValue(false),
    isInputFieldFocused: useSharedValue(false),
    isKeyboardVisible: useSharedValue(false),
  };

  const scrollViewKeyboardAvoid = {
    scrollViewRef: useAnimatedRef<Animated.ScrollView>(),
    scrollViewHeight: useSharedValue(0),
    scrollingLength: useSharedValue(0),
    scrollY: useSharedValue(0),
    isInputFieldFocused: useSharedValue(false),
    isScrollable: useSharedValue(false),
    isScrolledToTop: useSharedValue(false),
    isScrolledToEnd: useSharedValue(false),
  };

  if (contextName === 'bottomSheet') {
    return <BottomSheetProvider value={{ ...bottomSheet }}>{children}</BottomSheetProvider>;
  }

  if (contextName === 'scrollViewKeyboardAvoid') {
    return (
      <ScrollViewKeyboardAvoidProvider value={{ ...scrollViewKeyboardAvoid }}>
        {children}
      </ScrollViewKeyboardAvoidProvider>
    );
  }

  return null;
};

export default ReusablePropsProvider;
