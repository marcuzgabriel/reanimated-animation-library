/* Example on how to implement the BottomSheet to a ScrollView
and attach the scrollY as a controller to it */

import React, { useState, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import BottomSheet from 'components/BottomSheet';
import SnapEffect from 'components/BottomSheet/SnapEffect';

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

const ScrollView: React.FC<Props> = ({ children }) => {
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
      />
    </Wrapper>
  );
};

export default ScrollView;
