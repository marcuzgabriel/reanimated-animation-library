import React, { useCallback, useState } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import Content from './components/Content';
import SnapEffect from '../SnapEffect';
import { SCROLL_EVENT_THROTTLE } from '../../constants/configs';
import BottomSheet from '../../components/BottomSheet';
import { scrollTo } from '../../helpers/scrollTo';

const HEADER_HEIGHT = 70;

const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';

const screenObjectData = {
  currentScreen: 0,
  screens: [
    {
      title: 'Screen 1',
      text: 'Try to collapse the screen and go either forward or backward. resetCardPosition will ensure that the card will scroll to top and reset to default position which is a uncollapsed state',
    },
    {
      title: 'Screen 2',
      extraHeight: 100,
      text: 'Try to collapse the screen and go either forward or backward. resetCardPosition will ensure that the card will scroll to top and reset to default position which is a uncollapsed state',
    },
    {
      title: 'Screen 3',
      text: 'Try to collapse the screen and go either forward or backward. resetCardPosition will ensure that the card will scroll to top and reset to default position which is a uncollapsed state',
    },
  ],
};

const Wrapper = styled.View<{ windowHeight: number }>`
  position: absolute;
  height: ${({ windowHeight }): string => (isWeb ? `${windowHeight}px` : '100%')};
  width: 100%;
`;

const FakeContentWrapper = styled.View<{ windowHeight: number; extraHeight: number }>`
  background: white;
  height: ${({ windowHeight, extraHeight }): number => windowHeight + extraHeight}px;
  width: 100%;
  padding: 32px 16px;
  align-items: center;
`;

const ButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 20px;
`;

const Button = styled.TouchableOpacity<{ hasMarginRight?: boolean }>`
  height: 50px;
  width: 100px;
  background: black;
  margin-right: ${({ hasMarginRight }): number => (hasMarginRight ? 8 : 0)}px;
  justify-content: center;
`;

const Text = styled.Text<{ color?: string }>`
  color: ${({ color }): string => color ?? 'black'};
  text-align: center;
`;

const NoHardRerenderingEffect: React.FC = () => {
  const [screenObject, setScreenObject] = useState(screenObjectData);
  const { currentScreen, screens } = screenObject;

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

  const changeScreen = useCallback(
    (i: number, direction: string) => {
      const canGoBack = i !== 0 && direction === 'back';
      const canGoForward = i !== screenObjectData.screens.length - 1 && direction === 'next';

      if (canGoBack || canGoForward) {
        setScreenObject({
          ...screenObject,
          currentScreen: direction === 'next' ? currentScreen + 1 : currentScreen - 1,
        });
      }
    },
    [currentScreen, screenObject],
  );

  return (
    <Wrapper windowHeight={windowHeight}>
      <Animated.ScrollView
        ref={scrollViewRef}
        bounces={false}
        alwaysBounceVertical={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      >
        <SnapEffect cardHeight={cardHeight} snapEffectDirection={snapEffectDirection}>
          <FakeContentWrapper
            windowHeight={windowHeight}
            extraHeight={screens[currentScreen]?.extraHeight ?? 0}
          >
            <Text>{screens[currentScreen].title}</Text>
            <Text>{screens[currentScreen].text}</Text>
            <ButtonWrapper>
              <Button
                hasMarginRight={true}
                onPress={(): void => changeScreen(currentScreen, 'back')}
              >
                <Text color="white">Previous screen</Text>
              </Button>
              <Button onPress={(): void => changeScreen(currentScreen, 'next')}>
                <Text color="white">Next screen</Text>
              </Button>
            </ButtonWrapper>
          </FakeContentWrapper>
        </SnapEffect>
      </Animated.ScrollView>
      <BottomSheet
        resetCardPosition={(cb): void => {
          if (scrollViewRef && scrollY.value > 0) {
            scrollTo({ ref: scrollViewRef, to: 'top' });
            cb();
          } else {
            cb();
          }
        }}
        outerScrollEvent={{
          scrollY,
          autoScrollTriggerLength: 16,
        }}
        hideContentOnCardCollapse={{
          isEnabled: true,
          offset: 5,
        }}
        hideFooterOnCardCollapse={{
          isEnabled: true,
          offset: 30,
        }}
        fadingScrollEdges={{ isEnabled: false }}
        morphingArrow={{ isEnabled: Platform.OS !== 'web', offset: 20 }}
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

export default NoHardRerenderingEffect;
