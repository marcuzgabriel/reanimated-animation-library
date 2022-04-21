import React, { useContext, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { SimultaneousGesture } from 'react-native-gesture-handler';
import ScrollViewKeyboardAvoid from '../../ScrollViewKeyboardAvoid';
import {
  MAX_HEIGHT_RATIO,
  DEFAULT_SCROLL_ARROWS,
  DEFAULT_FADING_SCROLL_EDGES,
  DEFAULT_CONTENT_RESIZE_HEIGHT_ON_FOCSED_INPUT_FIELD,
  DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD,
} from '../../../constants/styles';
import { SCROLL_EVENT_THROTTLE, ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { scrollToPosition } from '../../../helpers';

interface Props {
  isScrollingCard: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
  scrollOffset: Animated.SharedValue<number>;
  contentGesture: SimultaneousGesture;
  children: React.ReactNode;
}

const Content: React.FC<Props> = ({
  isScrollingCard,
  isScrollable,
  scrollOffset,
  contentGesture,
  children,
}) => {
  const windowHeight = useWindowDimensions().height;

  const {
    fadingScrollEdges,
    scrollArrows,
    maxHeightRatio: configMaxHeightRatio,
    contentHeightWhenKeyboardIsVisible,
  } = useContext(UserConfigurationContext);

  const {
    keyboardHeight,
    contentHeight,
    headerHeight,
    footerHeight,
    footerTranslationY,
    scrollViewRef,
    scrollY,
    scrollViewHeight,
    translationY,
    isKeyboardVisible,
    isInputFieldFocused,
  } = useContext(ReusablePropsContext.bottomSheet);

  const { isEnabled: isFadingScrollEdgeEnabled, androidFadingEdgeLength } = fadingScrollEdges ?? {};

  const contentResizeHeightTrigger =
    contentHeightWhenKeyboardIsVisible?.resizeHeightTrigger ??
    DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD;

  const contentResizeHeightWhenKeyboardIsVisible =
    contentHeightWhenKeyboardIsVisible?.resizeHeight ??
    DEFAULT_CONTENT_RESIZE_HEIGHT_ON_FOCSED_INPUT_FIELD;

  const fadingEdgeAndroid = androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH;

  const maxHeight = useDerivedValue(
    () => (windowHeight - footerHeight.value) * (configMaxHeightRatio ?? MAX_HEIGHT_RATIO),
    [footerHeight, configMaxHeightRatio],
  );

  const derivedContentHeight = useDerivedValue(() => {
    const height = contentHeight.value > maxHeight.value ? maxHeight.value : contentHeight.value;

    if (isKeyboardVisible.value && keyboardHeight.value > 0) {
      if (contentHeightWhenKeyboardIsVisible?.takeUpAllAvailableSpace) {
        const offset = contentHeightWhenKeyboardIsVisible?.offset ?? 0;

        return (
          windowHeight - keyboardHeight.value - headerHeight.value - footerHeight.value - offset
        );
      }

      if (height > contentResizeHeightTrigger) {
        return contentResizeHeightWhenKeyboardIsVisible;
      } else {
        return height;
      }
    }

    return height;
  }, [isKeyboardVisible, keyboardHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    marginBottom: footerHeight.value,
    maxHeight: maxHeight.value,
    height: isKeyboardVisible?.value ? derivedContentHeight.value : '100%',
  }));

  /* NOTE: This callback is created outside the ScrollViewKeyboardAvoid component
  because NativeViewGestureHandler blocks refs within its scope */
  const scrollTo = useCallback(
    (to: string) => scrollToPosition({ ref: scrollViewRef, to }),
    [scrollViewRef],
  );

  return (
    <Animated.View style={animatedStyle}>
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        bounces={false}
        gesture={contentGesture}
        scrollTo={scrollTo}
        translationYValues={[translationY, footerTranslationY]}
        alwaysBounceVertical={false}
        directionalLockEnabled={true}
        connectScrollViewMeasuresToAnimationValues={{
          scrollY,
          scrollViewHeight,
          contentHeight,
          keyboardHeight,
          isKeyboardVisible,
          isInputFieldFocused,
          isScrollable,
        }}
        fadingEdgeLength={isFadingScrollEdgeEnabled ? fadingEdgeAndroid : 0}
        fadingScrollEdges={fadingScrollEdges ?? DEFAULT_FADING_SCROLL_EDGES}
        scrollArrows={scrollArrows ?? DEFAULT_SCROLL_ARROWS}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        onScrollBeginDrag={(e): void => {
          scrollOffset.value = e.nativeEvent.contentOffset.y;
        }}
        onTouchMove={(): void => {
          isScrollingCard.value = true;
        }}
        onTouchEnd={(): void => {
          isScrollingCard.value = false;
        }}
      >
        {children}
      </ScrollViewKeyboardAvoid>
    </Animated.View>
  );
};

export default Content;
