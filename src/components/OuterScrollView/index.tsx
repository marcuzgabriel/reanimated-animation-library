import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
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

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
`;

const OuterWrapper = styled.View`
  ${(): string => {
    if (Platform.OS === 'web') {
      return `
        position: relative;
        height: 100vh;
        width: 100%;
      `;
    } else {
      return ``;
    }
  }}
`;

const OuterScrollView: React.FC<Props> = ({ windowHeight, children }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const previousScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const contentSize = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

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

  const childWrapperStyle = { marginTop: -windowHeight };

  return (
    <OuterWrapper>
      <Animated.ScrollView
        ref={scrollViewRef}
        bounces={false}
        alwaysBounceVertical={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={SCROLL_EVENT_THROTTHLE}
        stickyHeaderIndices={[0]}
      >
        <BottomSheet
          windowHeight={windowHeight}
          scrollViewRef={scrollViewRef}
          previousScrollY={previousScrollY}
          scrollY={scrollY}
          contentSize={contentSize}
          layoutHeight={layoutHeight}
        />
        <Wrapper style={childWrapperStyle}>{children}</Wrapper>
      </Animated.ScrollView>
    </OuterWrapper>
  );
};

export default OuterScrollView;
