import React, { useCallback, useState } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import Content from './components/Content';
import Footer from './components/Footer';
import SnapEffect from '../SnapEffect';
import ScrollViewKeyboardAvoid from '../../components/ScrollViewKeyboardAvoid';
import { SCROLL_EVENT_THROTTLE } from '../../constants/configs';
import BottomSheet from '../../components/BottomSheet';
import { scrollToPosition } from '../../helpers/scrollToPosition';

const HEADER_HEIGHT = 70;

const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';

const SmallContentExtra = () => (
  <>
    <Text>
      Try to collapse the screen and go either forward or backward. resetCardPosition will ensure
      that the card will scroll to top and reset to default position which is a uncollapsed state
    </Text>
    <Text>
      Try to collapse the screen and go either forward or backward. resetCardPosition will ensure
      that the card will scroll to top and reset to default position which is a uncollapsed state
    </Text>
  </>
);

const screenObjectData = {
  currentScreen: -1,
  screens: [
    {
      title: 'Screen 1',
      extraHeight: 500,
      text: 'Try to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardTry to collapse the screen and go either forward or backward. resetCardPosition will Trawdawdadawdtion will Trawdawdadawdtion will Trawdawdadawdtion will Trawdawdadawdy to collapse the screen and go either forward or backward. resetCardPosition will ensurTry to collapse the screen and go either forward or backward. resetCardPosition will ensurTry to collapse the screen and go either forward or backward. resetCardPosition will ensurensure that the card will scroll to top and reset to default position which is a uncollapsed state',
      content: <Content />,
    },
    {
      title: 'Screen 2',
      extraHeight: 500,
      text: 'Try to collapse the screen and go either forward or backward. resetCardPosition will ensure that the card will scroll to top and reset to default position which is a uncollapsed state',
      content: <Content />,
    },
    {
      title: 'Screen 3',
      extraHeight: 2000,
      text: 'Try to collapse the screen and go either forward or backward. resetCardPosition will ensure that the card will scroll to top and reset to default position which is a uncollapsed state',
      content: <SmallContentExtra />,
    },
  ],
};

const Wrapper = styled.View<{ windowHeight: number }>`
  position: absolute;
  height: ${({ windowHeight }): string => (isWeb ? `${windowHeight}px` : '100%')};
  width: 100%;
`;

const FakeContentWrapper = styled.View<{ extraHeight: number }>`
  background: white;
  height: ${({ extraHeight }): number => extraHeight}px;
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

const CloseIcon = styled.View`
  position: absolute;
  right: 0px;
  top: 0px;
  height: 50px;
  width: 50px;
  background-color: white;
  border: 1px solid white;
`;

const NoHardRerenderingEffect: React.FC = () => {
  const [screenObject, setScreenObject] = useState(screenObjectData);
  const { currentScreen, screens } = screenObject;

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const cardHeight = useSharedValue(0);
  const snapEffectDirection = useSharedValue('');

  const windowHeight = useWindowDimensions().height;

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
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        bounces={false}
        alwaysBounceVertical={false}
        connectScrollViewMeasuresToAnimationValues={{
          scrollY,
        }}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      >
        <SnapEffect cardHeight={cardHeight} snapEffectDirection={snapEffectDirection}>
          <FakeContentWrapper extraHeight={screens[currentScreen]?.extraHeight ?? 0}>
            <Text>{screens[currentScreen]?.title}</Text>
            <Text>{screens[currentScreen]?.text}</Text>
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
      </ScrollViewKeyboardAvoid>
      <BottomSheet
        testID="test"
        initializeBottomSheetAsClosed={currentScreen === -1}
        springConfig={{ stiffness: 150 }}
        openBottomSheetRequest={{
          isEnabled: true,
          callback: (cb): void => {
            if (scrollViewRef?.current) {
              scrollToPosition({ ref: scrollViewRef, to: 'top' });
            }

            cb();
          },
        }}
        closeBottomSheetRequest={{
          isEnabled: true,
          callback: (cb): void => {
            if (scrollViewRef?.current) {
              scrollToPosition({ ref: scrollViewRef, to: 'top' });
            }

            cb();
          },
        }}
        contentHeightWhenKeyboardIsVisible={{
          takeUpAllAvailableSpace: true,
          resizeHeightTrigger: 270,
          resizeHeight: 200,
          closeIcon: {
            topOffset: 60,
            rightOffset: 20,
            icon: (): React.ReactNode => (
              <CloseIcon>
                <Text>Close btn</Text>
              </CloseIcon>
            ),
          },
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
        fadingScrollEdges={{ isEnabled: true }}
        morphingArrow={{ isEnabled: true, offset: 20 }}
        keyboardAvoidBottomMargin={isAndroid ? 16 : 0}
        snapEffectDirection={snapEffectDirection}
        snapPointBottom={HEADER_HEIGHT}
        onLayoutRequest={(height: number): void => {
          cardHeight.value = height;
        }}
        footerComponent={<Footer />}
        contentComponent={screens[currentScreen]?.content}
      />
    </Wrapper>
  );
};

export default NoHardRerenderingEffect;
