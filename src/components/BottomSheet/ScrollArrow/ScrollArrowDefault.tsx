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
import { UserConfigurationContext } from 'containers/UserConfigurationProvider';
interface Props {
  position: string;
  component?: React.ReactNode;
}

const TouchableOpacity = Animated.createAnimatedComponent(styled.TouchableOpacity<{
  position: string;
  topOffset?: number;
  bottomOffset?: number;
}>`
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 4;
  width: 100%;
  ${({ position, topOffset, bottomOffset }): string =>
    position === 'top' ? `top: ${topOffset ?? 0}` : `bottom: ${bottomOffset ?? 0}px`}
`);

const ScrollArrowDefault: React.FC<Props> = ({ position, component }) => {
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
  const { scrollArrows } = useContext(UserConfigurationContext);

  const isPositionedTop = useMemo(() => position === 'top', [position]);
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
      position={position}
      topOffset={scrollArrows?.topArrowOffset}
      bottomOffset={scrollArrows?.bottomArrowOffset}
      onPress={(): void =>
        scrollToHelper({ ref: scrollViewRef, to: isPositionedTop ? 'top' : 'end' })
      }
    >
      <Animated.View style={isPositionedTop ? animatedStyleUpArrow : animatedStyleDownArrow}>
        {component ?? (
          <SvgArrow
            height={scrollArrows?.dimensions}
            width={scrollArrows?.dimensions}
            fill={scrollArrows?.fill}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrowDefault;
