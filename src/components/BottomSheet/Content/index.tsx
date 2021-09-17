import React, { useMemo, useRef, useContext, useCallback } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import ScrollViewKeyboardAvoid from '../../ScrollViewKeyboardAvoid';
import { MAX_HEIGHT_RATIO } from '../../../constants/styles';
import { SCROLL_EVENT_THROTTLE, ANDROID_FADING_EDGE_LENGTH } from '../../../constants/configs';
import {
  DEFAULT_SCROLL_ARROWS,
  DEFAULT_FADING_SCROLL_EDGES,
  DEFAULT_CONTENT_RESIZE_HEIGHT_ON_FOCSED_INPUT_FIELD,
  DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD,
} from '../../../constants/styles';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { scrollToPosition } from '../../../helpers';

interface Props {
  isScrollingCard: Animated.SharedValue<boolean>;
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  children: React.ReactNode;
}

const Content: React.FC<Props> = ({ isScrollingCard, gestureHandler, children }) => {
  const panGestureInnerRef = useRef<PanGestureHandler>();
  const nativeViewGestureRef = useRef<NativeViewGestureHandler>();

  const windowHeight = useWindowDimensions().height;

  const {
    fadingScrollEdges,
    scrollArrows,
    maxHeight: configMaxHeight,
    contentResizeHeightTriggerOnFocusedInputField,
    contentResizeHeightOnFocusedInputField,
  } = useContext(UserConfigurationContext);

  const {
    contentHeight,
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
  const contentResizeHeightTriggerOnFocusedInputFieldSetup =
    contentResizeHeightTriggerOnFocusedInputField ??
    DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD;
  const contentResizeHeightOnFocusedInputFieldSetup =
    contentResizeHeightOnFocusedInputField ?? DEFAULT_CONTENT_RESIZE_HEIGHT_ON_FOCSED_INPUT_FIELD;

  const fadingEdgeAndroid = useMemo(
    () => androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH,
    [androidFadingEdgeLength],
  );

  const maxHeight = useDerivedValue(
    () => configMaxHeight ?? (windowHeight - footerHeight.value) * MAX_HEIGHT_RATIO,
    [footerHeight, configMaxHeight],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const height = contentHeight.value > maxHeight.value ? maxHeight.value : contentHeight.value;
    const heightWhenKeyboardIsVisible =
      height > contentResizeHeightTriggerOnFocusedInputFieldSetup
        ? contentResizeHeightOnFocusedInputFieldSetup
        : height;

    return {
      marginBottom: footerHeight.value,
      maxHeight: maxHeight.value,
      height: isKeyboardVisible?.value ? heightWhenKeyboardIsVisible : '100%',
    };
  });

  /* NOTE: This callback is created outside the ScrollViewKeyboardAvoid component
  because NativeViewGestureHandler blocks refs within its scope */
  const scrollTo = useCallback(
    (to: string) => scrollToPosition({ ref: scrollViewRef, to }),
    [scrollViewRef],
  );

  return (
    <PanGestureHandler
      enabled={Platform.OS !== 'web'}
      ref={panGestureInnerRef}
      shouldCancelWhenOutside={false}
      simultaneousHandlers={nativeViewGestureRef}
      onGestureEvent={gestureHandler}
    >
      <Animated.View style={animatedStyle}>
        <NativeViewGestureHandler
          ref={nativeViewGestureRef}
          shouldCancelWhenOutside={false}
          simultaneousHandlers={panGestureInnerRef}
        >
          <ScrollViewKeyboardAvoid
            ref={scrollViewRef}
            bounces={false}
            scrollTo={scrollTo}
            contentResizeHeightTriggerOnFocusedInputField={
              contentResizeHeightTriggerOnFocusedInputFieldSetup
            }
            translationYValues={[translationY, footerTranslationY]}
            alwaysBounceVertical={false}
            directionalLockEnabled={true}
            connectScrollViewMeasuresToAnimationValues={{
              scrollY,
              scrollViewHeight,
              contentHeight,
              isKeyboardVisible,
              isInputFieldFocused,
            }}
            fadingEdgeLength={isFadingScrollEdgeEnabled ? fadingEdgeAndroid : 0}
            fadingScrollEdges={fadingScrollEdges ?? DEFAULT_FADING_SCROLL_EDGES}
            scrollArrows={scrollArrows ?? DEFAULT_SCROLL_ARROWS}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
            onTouchMove={(): void => {
              isScrollingCard.value = true;
            }}
            onTouchEnd={(): void => {
              isScrollingCard.value = false;
            }}
          >
            {children}
          </ScrollViewKeyboardAvoid>
        </NativeViewGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Content;
