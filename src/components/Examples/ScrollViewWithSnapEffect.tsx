import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import BottomSheet from 'components/BottomSheet';
import SnapEffect from 'components/BottomSheet/SnapEffect';
import InputField from 'components/BottomSheet/InputField';

const SCROLL_EVENT_THROTTHLE = 16;
interface Props {
  children: React.ReactNode;
}

const Wrapper = styled.View<{ windowHeight: number }>`
  position: relative;
  height: ${({ windowHeight }): number => windowHeight}px;
  width: 100%;
`;

const BackgroundContent = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 1;
`;

const BottomSheetContentWrapper = styled.View`
  margin: 32px;
`;

const Text = styled.Text``;

const ScrollView: React.FC<Props> = ({ children }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const snapEffectDirection = useSharedValue('');

  const inputStyle = {
    width: '100%',
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: 'white',
  };

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
            {children}
          </SnapEffect>
        </Animated.ScrollView>
      </BackgroundContent>
      <BottomSheet
        onLayoutRequest={(height: number): void => {
          cardHeight.value = height;
        }}
        snapEffectDirection={snapEffectDirection}
        scrollY={scrollY}
      >
        <BottomSheetContentWrapper>
          <Text>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum."
          </Text>
          <InputField uniqueId={0} placeholder="useless placeholder" style={inputStyle} />
          <Text>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum."
          </Text>
          <InputField uniqueId="1234" placeholder="useless placeholder" style={inputStyle} />
        </BottomSheetContentWrapper>
      </BottomSheet>
    </Wrapper>
  );
};

export default ScrollView;
