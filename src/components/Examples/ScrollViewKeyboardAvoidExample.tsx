import React, { Fragment } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import InputField from '../InputField';
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

const fakeScrollItem = [
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  },
];

const Wrapper = styled.View<{ windowHeight: number }>`
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
`;

const FakeContentWrapper = styled.View<{ windowHeight: number }>`
  background: white;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  padding: 32px 16px;
`;

const AnimatedWrapper = Animated.View;
const Text = styled.Text``;

const ScrollViewKeyboardAvoidExample: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const windowHeight = useWindowDimensions().height;
  const translationY = useSharedValue(0);
  const isKeyboardVisible = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      height: isKeyboardVisible?.value ? 150 : windowHeight,
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  return (
    <Wrapper windowHeight={windowHeight}>
      <AnimatedWrapper style={animatedStyle}>
        <ScrollViewKeyboardAvoid
          ref={scrollViewRef}
          bounces={false}
          alwaysBounceVertical={false}
          translationYValues={[translationY]}
          keyboardAvoidBottomMargin={isIOS ? 64 : 100}
          connectScrollViewMeasuresToAnimationValues={{
            isKeyboardVisible,
          }}
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
          <>
            {fakeScrollItem.map(({ text }, i) => (
              <Fragment key={i}>
                <FakeContentWrapper windowHeight={windowHeight} key={`${i}_${text}`}>
                  <Text>
                    {text} <InputField uniqueId="wtf" style={inputStyle} />
                  </Text>
                </FakeContentWrapper>
                <InputField uniqueId={i} style={inputStyle} />
              </Fragment>
            ))}
          </>
        </ScrollViewKeyboardAvoid>
      </AnimatedWrapper>
    </Wrapper>
  );
};

export default ScrollViewKeyboardAvoidExample;
