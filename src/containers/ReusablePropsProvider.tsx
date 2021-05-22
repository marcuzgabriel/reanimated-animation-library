import React, { createContext } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedRef } from 'react-native-reanimated';

export const ReusablePropsContext = createContext<Record<string, any>>({});
export const { Provider } = ReusablePropsContext;

interface Props {
  children: React.ReactNode;
}

const ReusablePropsProvider: React.FC<Props> = ({ children }) => {
  /* Measures */
  const headerHeight = useSharedValue(0);
  const footerHeight = useSharedValue(0);
  const cardContentHeight = useSharedValue(0);
  const cardHeight = useSharedValue(0);

  /* Scroll & Pan */
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollViewHeight = useSharedValue(0);
  const scrollingLength = useSharedValue(0);
  const translationY = useSharedValue(0);
  const footerTranslationY = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const isScrollable = useSharedValue(false);
  const isScrolledToTop = useSharedValue(false);
  const isScrolledToEnd = useSharedValue(false);

  /* General */
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const isWeb = useSharedValue(Platform.OS === 'web');

  return (
    <Provider
      value={{
        cardHeight,
        headerHeight,
        footerHeight,
        cardContentHeight,
        innerScrollY,
        isScrollable,
        isScrolledToTop,
        isScrolledToEnd,
        scrollViewHeight,
        scrollingLength,
        scrollViewRef,
        windowHeight,
        windowWidth,
        translationY,
        footerTranslationY,
        isWeb,
      }}
    >
      {children}
    </Provider>
  );
};

export default ReusablePropsProvider;
