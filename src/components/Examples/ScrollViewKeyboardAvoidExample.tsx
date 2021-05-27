import React, { Fragment } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import InputField from '../InputField';
import ScrollViewKeyboardAvoid from '../ScrollViewKeyboardAvoid';
import { SCROLL_EVENT_THROTTLE } from '../../constants/configs';

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
];

const Wrapper = styled.View<{ windowHeight: number }>`
  position: relative;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
`;

const FakeContentWrapper = styled.View<{ windowHeight: number }>`
  background: white;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  padding: 32px 16px;
`;

const Text = styled.Text``;

const ScrollViewKeyboardAvoidExample: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const contentHeight = useSharedValue(0);
  const windowHeight = useWindowDimensions().height;

  return (
    <Wrapper windowHeight={windowHeight}>
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        scrollArrows={{
          isEnabled: true,
          dimensions: 40,
          fill: 'black',
          topArrowOffset: 40,
          bottomArrowOffset: 40,
        }}
        contentHeight={contentHeight}
        onContentSizeChange={(_, height): void => {
          contentHeight.value = height;
        }}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      >
        {fakeScrollItem.map(({ text }, i) => (
          <Fragment key={i}>
            <FakeContentWrapper windowHeight={windowHeight} key={`${i}_${text}`}>
              <Text>
                {text} <InputField uniqueId="wtf" style={inputStyle} />
              </Text>
            </FakeContentWrapper>
            <InputField uniqueId="wtf" style={inputStyle} />
          </Fragment>
        ))}
      </ScrollViewKeyboardAvoid>
    </Wrapper>
  );
};

export default ScrollViewKeyboardAvoidExample;