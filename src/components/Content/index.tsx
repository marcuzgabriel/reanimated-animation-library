import React from 'react';
import { LayoutChangeEvent, SafeAreaView } from 'react-native';
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
  align-items: center;
  height: 600px;
  background: rgba(0, 0, 0, 0.25);
`;

const WrapperTwo = styled.View`
  height: 100px;
  width: 100%;
  background: black;
`;

const TextInput = styled.TextInput`
  margin: 16px;
  width: 100%;
  height: 50px;
  text-align: center;
  border-radius: 6px;
  background-color: white;
`;

const Content: React.FC<Props> = ({ contentHeight }) => {
  const onLayout = (e: LayoutChangeEvent): void => {
    contentHeight?.setValue(e.nativeEvent.layout.height);
  };

  return (
    <SafeAreaView>
      <Wrapper onLayout={onLayout}>
        <WrapperOne>
          <Text>Ipsem lorem whatever magic harry potter stuff</Text>
          <TextInput placeholder="useless placeholder" keyboardType="numeric" />
        </WrapperOne>
        <WrapperTwo />
      </Wrapper>
    </SafeAreaView>
  );
};

export default Content;
