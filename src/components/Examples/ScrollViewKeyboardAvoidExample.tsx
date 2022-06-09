import React, { Fragment } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import InputField from '../InputField';
import Regular from '../InputField/Regular';
import InputAnimationWrapper from '../InputField/InputAnimationWrapper';
import ScrollViewKeyboardAvoid from '../ScrollViewKeyboardAvoid';
import { SCROLL_EVENT_THROTTLE } from '../../constants/configs';

const isIOS = Platform.OS === 'ios';

const inputStyle = {
  width: '100%',
  height: 50,
  textAlign: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  borderWidth: 2,
  borderColor: 'black',
  backgroundColor: 'white',
};

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const Wrapper = styled.View<{ windowHeight: number }>`
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
`;

const FakeContentWrapper = styled.View`
  height: 100%;
  width: 100%;
  border: 2px solid black;
  padding: 32px 16px;
`;

const AnimatedWrapper = Animated.View;
const Text = styled.Text``;

const ScrollViewKeyboardAvoidExample: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const windowHeight = useWindowDimensions().height;
  const translationY = useSharedValue(0);

  const scrollY = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const isInputFieldFocused = useSharedValue(false);
  const isScrollable = useSharedValue(false);
  const isKeyboardVisible = useSharedValue(false);

  const animationScrollValues = {
    scrollY,
    scrollViewHeight,
    contentHeight,
    keyboardHeight,
    isInputFieldFocused,
    isScrollable,
    isKeyboardVisible,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  return (
    <Wrapper windowHeight={windowHeight}>
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        bounces={false}
        alwaysBounceVertical={false}
        keyboardAvoidBottomMargin={isIOS ? 64 : 100}
        connectScrollViewMeasuresToAnimationValues={animationScrollValues}
        fadingScrollEdges={{
          isEnabled: true,
          iOSandWebFadingEdgeHeight: 150,
          nativeBackgroundColor: 'black',
          webBackgroundColorTop: {
            from: 'rgba(0, 0, 0, 0.05)',
            to: 'rgba(0,0,0,0.05)',
          },
          webBackgroundColorBottom: {
            to: 'rgba(0, 0, 0, 0.05)',
            from: 'rgba(0,0,0,0.05)',
          },
        }}
        scrollArrows={{
          isEnabled: true,
          dimensions: 40,
          fill: 'black',
          topArrowOffset: 40,
          bottomArrowOffset: 40,
        }}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      >
        <FakeContentWrapper>
          <Text>{text}</Text>
          <InputAnimationWrapper {...animationScrollValues}>
            <Regular placeholder="Testing inputfield" />
          </InputAnimationWrapper>
        </FakeContentWrapper>
      </ScrollViewKeyboardAvoid>
    </Wrapper>
  );
};

export default ScrollViewKeyboardAvoidExample;
