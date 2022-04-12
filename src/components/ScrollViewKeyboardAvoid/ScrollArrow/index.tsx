import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { onScrollArrowAppearanceReaction } from '../../../worklets';
import { scrollToPosition } from '../../../helpers';
import { ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../../../constants/animations';
import {
  SCROLL_ARROW_FILL,
  SCROLL_ARROW_DIMENSIONS,
  SCROLL_ARROW_OFFSET,
} from '../../../constants/styles';
import type { ScrollArrowProps } from '../../../types';

const SVG_ARROW_ROTATION = 90;

const SvgArrowWrapper = styled.View<{ rotation: number }>`
  transform: ${({ rotation }): string => `rotate(${rotation}deg)`};
`;

const TouchableOpacity = Animated.createAnimatedComponent(styled.TouchableOpacity<{
  position: string;
  topOffset: number;
  bottomOffset: number;
  scrollArrowLeftRatio?: number;
}>`
  position: absolute;
  align-items: center;
  justify-content: center;
  ${({ position, topOffset, bottomOffset }): string =>
    position === 'top' ? `top: ${topOffset}px` : `bottom: ${bottomOffset}px`}
`);

const ScrollArrow: React.FC<ScrollArrowProps> = props => {
  const {
    scrollArrows,
    scrollViewRef,
    scrollViewWidth,
    scrollY,
    isScrolledToTop,
    isScrolledToEnd,
    isScrollable,
    position,
    isInputFieldFocused,
    scrollTo,
  } = props;

  const { fill, dimensions, topArrowOffset, bottomArrowOffset } = scrollArrows ?? {};
  const isPositionedTop = position === 'top';

  const opacityInterpolationTopArrow = useSharedValue(ARROW_UP_OFFSET);
  const opacityInterpolationEndArrow = useSharedValue(ARROW_DOWN_OFFSET);
  const animatedValueIsPositionedTop = useSharedValue(isPositionedTop);
  const isScrolling = useSharedValue(false);

  const arrowFill = fill ?? SCROLL_ARROW_FILL;
  const arrowDimensions = dimensions ?? SCROLL_ARROW_DIMENSIONS;
  const arrowTopOffset = topArrowOffset ?? SCROLL_ARROW_OFFSET;
  const arrowBottomOffset = bottomArrowOffset ?? SCROLL_ARROW_OFFSET;

  const scrollArrowLeftRatio = useDerivedValue(() => {
    const centerAlignedScrollArrowRatio = arrowDimensions / 2;
    return 50 - (centerAlignedScrollArrowRatio / scrollViewWidth.value) * 100;
  }, [arrowDimensions, scrollViewWidth]);

  useAnimatedReaction(
    () => ({
      scrollY: scrollY.value,
      isScrollable: isScrollable.value,
      isScrolledToEnd: isScrolledToEnd.value,
      isScrolledToTop: isScrolledToTop.value,
      isInputFieldFocused: isInputFieldFocused.value,
    }),
    () => {
      onScrollArrowAppearanceReaction({
        isScrolledToTop,
        isScrolledToEnd,
        isInputFieldFocused,
        opacityInterpolationEndArrow,
        opacityInterpolationTopArrow,
        isScrolling,
        isScrollable,
      });
    },
    [scrollY, isScrollable, isScrolledToEnd, isScrolledToTop, isInputFieldFocused],
  );

  const animatedStyleUpArrow = useAnimatedStyle(() => ({
    opacity: interpolate(opacityInterpolationTopArrow.value, [ARROW_UP_OFFSET, 0], [0, 1]),
  }));

  const animatedStyleDownArrow = useAnimatedStyle(() => ({
    opacity: interpolate(opacityInterpolationEndArrow.value, [0, ARROW_DOWN_OFFSET], [1, 0]),
  }));

  const animatedStyleTouchableOpacity = useAnimatedStyle(() =>
    animatedValueIsPositionedTop.value
      ? {
          left: `${scrollArrowLeftRatio.value}%`,
          zIndex: interpolate(
            opacityInterpolationTopArrow.value,
            [ARROW_UP_OFFSET, ARROW_UP_OFFSET + 1, -1, 0],
            [-1, 4, 4, 4],
          ),
        }
      : {
          left: `${scrollArrowLeftRatio.value}%`,
          zIndex: interpolate(
            opacityInterpolationEndArrow.value,
            [0, 1, ARROW_DOWN_OFFSET - 1, ARROW_DOWN_OFFSET],
            [4, 4, 4, -1],
          ),
        },
  );

  return (
    <TouchableOpacity
      position={position}
      topOffset={arrowTopOffset}
      bottomOffset={arrowBottomOffset}
      style={animatedStyleTouchableOpacity}
      onPress={(): void => {
        if (scrollTo) {
          scrollTo(isPositionedTop ? 'top' : 'end');
        } else {
          scrollToPosition({
            ref: scrollViewRef,
            to: isPositionedTop ? 'top' : 'end',
          });
        }
      }}
    >
      <Animated.View style={isPositionedTop ? animatedStyleUpArrow : animatedStyleDownArrow}>
        <SvgArrowWrapper rotation={isPositionedTop ? -SVG_ARROW_ROTATION : SVG_ARROW_ROTATION}>
          <SvgArrow height={arrowDimensions} width={arrowDimensions} fill={arrowFill} />
        </SvgArrowWrapper>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrow;
