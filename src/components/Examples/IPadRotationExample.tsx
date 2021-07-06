import React, { Fragment } from 'react';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import ScrollViewKeyboardAvoid from '../ScrollViewKeyboardAvoid';

const Wrapper = styled.View<{ height: number }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${({ height }): number => height}px;
`;

const Left = styled.View`
  flex: 1;
  height: 100%;
`;

const FakeContentWrapper = styled.View<{ height: number }>`
  background: white;
  height: ${({ height }): number => height}px;
  width: 100%;
  padding: 32px 16px;
`;

const Text = styled.Text``;

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

const IPadRotationExmaple: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const windowHeight = useWindowDimensions().height;

  return (
    <Wrapper height={windowHeight}>
      <Left />
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        bounces={false}
        scrollArrows={{
          isEnabled: true,
          dimensions: 40,
          fill: 'black',
          topArrowOffset: 40,
          bottomArrowOffset: 40,
        }}
        scrollEventThrottle={16}
      >
        {fakeScrollItem.map(({ text }, i) => (
          <Fragment key={i}>
            <FakeContentWrapper height={windowHeight} key={`${i}_${text}`}>
              <Text>{text}</Text>
            </FakeContentWrapper>
          </Fragment>
        ))}
      </ScrollViewKeyboardAvoid>
    </Wrapper>
  );
};

export default IPadRotationExmaple;
