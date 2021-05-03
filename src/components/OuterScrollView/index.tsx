/* Example on how to implement the BottomSheet to a ScrollView
and attach the scrollY as a controller to it */

import React, { useRef } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import BottomSheet from '../BottomSheet';

const SCROLL_EVENT_THROTTHLE = 16;
interface Props {
  windowHeight: number;
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

const OuterScrollView: React.FC<Props> = ({ windowHeight, children }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const previousScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const contentSize = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const scrollYOldSchool = useRef(new Animated.Value<number>(0)).current;

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      if (e.contentOffset.y >= 0) {
        previousScrollY.value = scrollY.value;
        scrollY.value = e.contentOffset.y;
        contentSize.value = e.contentSize.height;
        layoutHeight.value = e.layoutMeasurement.height;
      }
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
          <Wrapper windowHeight={windowHeight}>{children}</Wrapper>
          <Wrapper windowHeight={windowHeight}>{children}</Wrapper>
        </Animated.ScrollView>
      </BackgroundContent>
      <BottomSheet
        windowHeight={windowHeight}
        scrollY={scrollY}
        scrollYOldSchool={scrollYOldSchool}
      />
    </Wrapper>
  );
};

export default OuterScrollView;
