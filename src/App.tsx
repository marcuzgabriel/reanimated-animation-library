import React from 'react';
import styled from 'styled-components/native';
import OuterScrollView from './components/OuterScrollView';
import { useWindowDimensions } from 'react-native';

interface WindowProp {
  windowHeight: number;
}

const Text = styled.Text``;

const FakeContentWrapper = styled.View<WindowProp>`
  background: white;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  padding: 32px 16px;
`;

const fakeScrollItem = [
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  },
];

const App: React.FC = () => {
  const windowHeight = useWindowDimensions().height;

  return (
    <OuterScrollView windowHeight={windowHeight}>
      {fakeScrollItem.map(({ text }, i) => (
        <FakeContentWrapper windowHeight={windowHeight} key={`${i}_${text}`}>
          <Text>{text}</Text>
        </FakeContentWrapper>
      ))}
    </OuterScrollView>
  );
};

export default App;
