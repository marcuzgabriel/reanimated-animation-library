import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import BottomSheet from '../BottomSheet';

const isWeb = Platform.OS === 'web';

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

const OuterScrollView: React.FC<Props> = ({ windowHeight, children }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const previousScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const contentSize = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      previousScrollY.value = scrollY.value;
      scrollY.value = e.contentOffset.y;
      contentSize.value = e.contentSize.height;
      layoutHeight.value = e.layoutMeasurement.height;
    },
  });

  const contentContainerStyle = { marginTop: isWeb ? -windowHeight : 0 };
  const childWrapperStyle = { marginTop: isWeb ? 0 : -windowHeight };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      bounces={false}
      alwaysBounceVertical={false}
      onScroll={onScrollHandler}
      scrollEventThrottle={SCROLL_EVENT_THROTTHLE}
      contentContainerStyle={contentContainerStyle}
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
  );
};

export default OuterScrollView;
