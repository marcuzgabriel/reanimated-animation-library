import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

interface Props {
  contentHeight?: Animated.Value<number>;
}

const Wrapper = styled.View``;

const Text = styled.Text``;

const WrapperOne = styled.View`
  width: 100%;
  padding: 32px 16px;
  justify-content: top;
  align-items: center;
  height: 600px;
  background: rgba(0, 0, 0, 0.25);
`;

const WrapperTwo = styled.View`
  height: 100px;
  width: 100%;
  background: black;
`;

const Content: React.FC<Props> = ({ contentHeight }) => {
  const onLayout = (e: LayoutChangeEvent): void => {
    contentHeight?.setValue(e.nativeEvent.layout.height);
  };

  return (
    <Wrapper onLayout={onLayout}>
      <WrapperOne>
        <Text>Ipsem lorem whatever magic harry potter stuff</Text>
      </WrapperOne>
      <WrapperTwo />
    </Wrapper>
  );
};

export default Content;
