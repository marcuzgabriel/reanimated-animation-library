import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import Content from './components/Content';
import BottomSheet from '../../components/BottomSheet';
import SnapEffect from '../SnapEffect';

const HEADER_HEIGHT = 70;

const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';

const fakeScrollItem = [
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
`,
  },
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
`,
  },
];

const Wrapper = styled.View<{ windowHeight: number }>`
  position: relative;
  height: ${({ windowHeight }): string => (isWeb ? `${windowHeight}px` : '100%')};
  width: 100%;
`;

const Text = styled.Text``;

const FakeContentWrapper = styled.View<{ windowHeight: number }>`
  background: white;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  padding: 32px 16px;
`;

const ScrollViewWithSnapEffect: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const snapEffectDirection = useSharedValue('');

  const windowHeight = useWindowDimensions().height;

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <Wrapper windowHeight={windowHeight}>
      <Animated.ScrollView
        ref={scrollViewRef}
        bounces={false}
        alwaysBounceVertical={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
      >
        <SnapEffect cardHeight={cardHeight} snapEffectDirection={snapEffectDirection}>
          {fakeScrollItem.map(({ text }, i) => (
            <FakeContentWrapper windowHeight={windowHeight} key={`${i}_${text}`}>
              <Text>{text}</Text>
            </FakeContentWrapper>
          ))}
        </SnapEffect>
      </Animated.ScrollView>
      <BottomSheet
        outerScrollEvent={{
          scrollY,
          autoScrollTriggerLength: 16,
        }}
        contentResizeHeightTriggerOnFocusedInputField={270}
        contentResizeHeightOnFocusedInputField={200}
        hideContentOnCardCollapse={{
          isEnabled: true,
          offset: 5,
        }}
        hideFooterOnCardCollapse={{
          isEnabled: true,
          offset: 30,
        }}
        fadingScrollEdges={{ isEnabled: false }}
        morphingArrow={{ isEnabled: true, offset: 20 }}
        keyboardAvoidBottomMargin={isAndroid ? 16 : 0}
        snapEffectDirection={snapEffectDirection}
        snapPointBottom={HEADER_HEIGHT}
        onLayoutRequest={(height: number): void => {
          cardHeight.value = height;
        }}
        contentComponent={<Content />}
      />
    </Wrapper>
  );
};

export default ScrollViewWithSnapEffect;
