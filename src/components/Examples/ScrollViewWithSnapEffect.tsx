import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import Content from './components/Content';
import BottomSheet from '../../components/BottomSheet';
import SnapEffect from '../../components/BottomSheet/SnapEffect';

const SCROLL_EVENT_THROTTHLE = 16;
const SCROLL_ARROW_DIMESIONS = 40;
const SCROLL_ARROW_OFFSET = 5;
const HEADER_HEIGHT = 50;
const EXTRA_SNAP_POINT_OFFSET = 30;

const fakeScrollItem = [
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

const Text = styled.Text``;

const FakeContentWrapper = styled.View<{ windowHeight: number }>`
  background: white;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
  padding: 32px 16px;
`;

const BackgroundContent = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 1;
`;

const Arrow = styled.View`
  width: 50px;
  height: 50px;
  background-color: black;
  border: 1px solid black;
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
      <BackgroundContent>
        <Animated.ScrollView
          ref={scrollViewRef}
          bounces={false}
          alwaysBounceVertical={false}
          onScroll={onScrollHandler}
          scrollEventThrottle={SCROLL_EVENT_THROTTHLE}
        >
          <SnapEffect cardHeight={cardHeight} snapEffectDirection={snapEffectDirection}>
            {fakeScrollItem.map(({ text }, i) => (
              <FakeContentWrapper windowHeight={windowHeight} key={`${i}_${text}`}>
                <Text>{text}</Text>
              </FakeContentWrapper>
            ))}
          </SnapEffect>
        </Animated.ScrollView>
      </BackgroundContent>
      <BottomSheet
        scrollY={scrollY}
        snapEffectDirection={snapEffectDirection}
        snapPointBottom={HEADER_HEIGHT + EXTRA_SNAP_POINT_OFFSET}
        onLayoutRequest={(height: number): void => {
          cardHeight.value = height;
        }}
        header={{
          height: 20,
        }}
        contentComponent={<Content />}
      />
    </Wrapper>
  );
};

export default ScrollViewWithSnapEffect;
