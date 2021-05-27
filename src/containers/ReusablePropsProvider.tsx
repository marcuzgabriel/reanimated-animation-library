import React, { createContext } from 'react';
import Animated, { useSharedValue, useAnimatedRef, useDerivedValue } from 'react-native-reanimated';

export const ReusablePropsContext = {
  bottomSheet: createContext<Record<string, any>>({}),
  scrollViewKeyboardAvoid: createContext<Record<string, any>>({}),
};

export const { Provider: BottomSheetProvider } = ReusablePropsContext.bottomSheet;
export const {
  Provider: ScrollViewKeyboardAvoidProvider,
} = ReusablePropsContext.scrollViewKeyboardAvoid;

interface Props {
  type: string;
  children: React.ReactNode;
}

const ReusablePropsProvider: React.FC<Props> = ({ type, children }) => {
  const bottomSheet = {
    headerHeight: useSharedValue(0),
    footerHeight: useSharedValue(0),
    cardContentHeight: useSharedValue(0),
    cardHeight: useSharedValue(0),
    scrollViewRef: useAnimatedRef<Animated.ScrollView>(),
    scrollViewHeight: useSharedValue(0),
    scrollingLength: useSharedValue(0),
    translationY: useSharedValue(0),
    footerTranslationY: useSharedValue(0),
    innerScrollY: useSharedValue(0),
    isScrollable: useSharedValue(false),
    isScrolledToTop: useSharedValue(false),
    isScrolledToEnd: useSharedValue(false),
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

  if (type === 'bottomSheet') {
    return <BottomSheetProvider value={{ ...bottomSheet }}>{children}</BottomSheetProvider>;
  }

  if (type === 'scrollViewKeyboardAvoid') {
    return (
      <ScrollViewKeyboardAvoidProvider value={{ ...scrollViewKeyboardAvoid }}>
        {children}
      </ScrollViewKeyboardAvoidProvider>
    );
  }

  return null;
};

export default ReusablePropsProvider;
