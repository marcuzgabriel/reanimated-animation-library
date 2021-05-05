/* Example on how to implement the BottomSheet to a ScrollView
and attach the scrollY as a controller to it */

import React, { useState, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedReaction,
} from 'react-native-reanimated';
import BottomSheet from '../BottomSheet';
import SnapEffect from 'components/SnapEffect';
import { isSnappableReaction } from 'worklets';

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

const OuterScrollView: React.FC<Props> = ({ children }) => {
  const [isSnapEffectActiveState, setIsSnapEffectActiveState] = useState<boolean>(false);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const previousScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const contentSize = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const snapEffectDirection = useSharedValue('');
  const cardHeight = useSharedValue(0);
  const scrollYOldSchool = useRef(new Animated.Value<number>(0)).current;

  const isScrollable = useSharedValue(false);
  const isCardOverlappingContent = useSharedValue(false);
  const isSnapEffectActive = useSharedValue(false);

  const windowHeight = useWindowDimensions().height;

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

  useAnimatedReaction(
    () => ({ cardHeight, contentHeight }),
    (
      result: Record<string, Animated.SharedValue<number | boolean>> | undefined,
      previous: Record<string, Animated.SharedValue<number | boolean>> | null | undefined,
    ) =>
      isSnappableReaction({
        result,
        previous,
        windowHeight,
        isCardOverlappingContent,
        isSnapEffectActive,
        isSnapEffectActiveState,
        isScrollable,
        setIsSnapEffectActiveState,
      }),
    [cardHeight, contentHeight],
  );

  return (
    <Wrapper windowHeight={windowHeight}>
      <BackgroundContent>
        <Animated.ScrollView
          ref={scrollViewRef}
          bounces={false}
          alwaysBounceVertical={false}
          onScroll={onScrollHandler}
          onContentSizeChange={(_, height): void => {
            contentHeight.value = height;
          }}
          scrollEventThrottle={SCROLL_EVENT_THROTTHLE}
        >
          <SnapEffect
            isSnapEffectActive={isSnapEffectActiveState}
            snapEffectDirection={snapEffectDirection}
          >
            <Wrapper windowHeight={windowHeight}>{children}</Wrapper>
          </SnapEffect>
        </Animated.ScrollView>
      </BackgroundContent>
      <BottomSheet
        onLayoutRequest={(height: number): void => {
          cardHeight.value = height;
        }}
        snapEffectDirection={snapEffectDirection}
        scrollY={scrollY}
        scrollYOldSchool={scrollYOldSchool}
      />
    </Wrapper>
  );
};

export default OuterScrollView;
