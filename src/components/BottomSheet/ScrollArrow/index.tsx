import React, { useMemo, useContext } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { ReusablePropsContext } from 'containers/ReusablePropsProvider';
import { onScrollArrowAppearanceReaction } from 'worklets';
import { scrollTo as scrollToHelper } from 'helpers';
import { ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from 'constants/animations';

const BOTTOM_OFFSET = 5;

interface Props {
  height: number;
  width: number;
  direction: string;
  fill: string;
}

const TouchableOpacity = Animated.createAnimatedComponent(styled.TouchableOpacity<{
  type: string;
  offset: number;
}>`
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 4;
  width: 100%;
  ${({ type }): string => (type === 'up' ? `top: 0px` : `bottom: ${BOTTOM_OFFSET}px`)}
`);

const ScrollArrow: React.FC<Props> = ({ direction, height, width, fill }) => {
  const {
    scrollViewRef,
    scrollViewHeight,
    cardContentHeight,
    innerScrollY,
    scrollingLength,
    isScrolledToTop,
    isScrolledToEnd,
    isScrollable,
  } = useContext(ReusablePropsContext);

  const isDirectionUp = useMemo(() => direction === 'up', [direction]);
  const translationYUpArrow = useSharedValue(ARROW_UP_OFFSET);
  const translationYDownArrow = useSharedValue(ARROW_DOWN_OFFSET);

  useAnimatedReaction(
    () => ({
      isScrollable: cardContentHeight.value > scrollViewHeight.value,
      innerScrollY: innerScrollY.value,
    }),
    (result: Record<string, any>, _previous: Record<string, any> | null | undefined) => {
      onScrollArrowAppearanceReaction({
        result,
        cardContentHeight,
        scrollViewHeight,
        translationYUpArrow,
        translationYDownArrow,
        scrollingLength,
        isScrolledToTop,
        isScrolledToEnd,
        isScrollable,
      });
    },
    [innerScrollY, cardContentHeight, scrollViewHeight],
  );

  const animatedStyleUpArrow = useAnimatedStyle(() => ({
    opacity: interpolate(translationYUpArrow.value, [ARROW_UP_OFFSET, 0], [0, 1]),
    transform: [{ translateY: translationYUpArrow.value }, { rotate: '-90deg' }],
  }));

  const animatedStyleDownArrow = useAnimatedStyle(() => ({
    opacity: interpolate(translationYDownArrow.value, [0, ARROW_DOWN_OFFSET], [1, 0]),
    transform: [{ translateY: translationYDownArrow.value }, { rotate: '90deg' }],
  }));

  return (
    <TouchableOpacity
      type={direction}
      offset={height / 2}
      onPress={(): void =>
        scrollToHelper({ ref: scrollViewRef, to: isDirectionUp ? 'top' : 'end' })
      }
    >
      <Animated.View style={isDirectionUp ? animatedStyleUpArrow : animatedStyleDownArrow}>
        <SvgArrow width={height} height={width} fill={fill} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrow;
