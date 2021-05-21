import React, { useMemo, useContext } from 'react';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { ReusablePropsContext } from 'containers/ReusablePropsProvider';
import { DEFAULT_TIMING_CONFIG } from 'constants/animations';

const ROTATION = 90;
const BOTTOM_OFFSET = 5;

interface Props {
  height: number;
  width: number;
  direction: string;
  fill: string;
}

interface ScrollTo {
  ref: React.RefObject<Animated.ScrollView>;
  to: string;
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
    isScrollable,
    innerScrollY,
  } = useContext(ReusablePropsContext);

  const isDirectionUp = useMemo(() => direction === 'up', [direction]);
  const translationYUpArrow = useSharedValue(-15);
  const translationYDownArrow = useSharedValue(15);

  const scrollingLength = useDerivedValue(() => cardContentHeight.value - scrollViewHeight.value);

  const scrollTo = ({ ref, to }: ScrollTo): void => {
    if (ref?.current) {
      const { scrollToEnd: fnEnd, scrollTo: fnTo }: any = ref.current;
      return to === 'end' ? fnEnd({ animated: true }) : fnTo({ y: 0, animated: true });
    }
  };

  useAnimatedReaction(
    () => ({
      scrollingLength: scrollingLength.value,
      innerScrollY: innerScrollY.value,
      isScrollable: isScrollable.value,
    }),
    (
      result: Record<string, number | boolean>,
      previous: Record<string, number | boolean> | null | undefined,
    ) => {
      if (result !== previous && scrollingLength.value > 0) {
        const isScrolledToTop = innerScrollY.value <= 20;
        const isScrolledToEnd =
          Math.floor(innerScrollY.value) === Math.floor(scrollingLength.value);

        if (isScrolledToTop && translationYUpArrow.value === 0) {
          translationYUpArrow.value = withTiming(-15, DEFAULT_TIMING_CONFIG);
        }

        if (isScrolledToTop && translationYDownArrow.value !== 0) {
          translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
        } else if (isScrolledToEnd && translationYDownArrow.value === 0) {
          translationYDownArrow.value = withTiming(15, DEFAULT_TIMING_CONFIG);
        } else {
          if (translationYDownArrow.value !== 0 && !isScrolledToEnd) {
            translationYDownArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
          }

          if (translationYUpArrow.value !== 0 && !isScrolledToTop) {
            translationYUpArrow.value = withTiming(0, DEFAULT_TIMING_CONFIG);
          }
        }
      }
    },
    [innerScrollY, scrollingLength, isScrollable],
  );

  const animatedStyleUpArrow = useAnimatedStyle(() => {
    const opacityInterpolationUpArrow = interpolate(translationYUpArrow.value, [-15, 0], [0, 1]);

    return {
      opacity: opacityInterpolationUpArrow,
      transform: [{ translateY: translationYUpArrow.value }, { rotate: '-90deg' }],
    };
  });

  const animatedStyleDownArrow = useAnimatedStyle(() => {
    const opacityInterpolationDownArrow = interpolate(translationYDownArrow.value, [0, 15], [1, 0]);

    return {
      opacity: opacityInterpolationDownArrow,
      transform: [{ translateY: translationYDownArrow.value }, { rotate: '90deg' }],
    };
  });

  return (
    <TouchableOpacity
      type={direction}
      offset={height / 2}
      onPress={(): void => scrollTo({ ref: scrollViewRef, to: isDirectionUp ? 'top' : 'end' })}
    >
      <Animated.View style={isDirectionUp ? animatedStyleUpArrow : animatedStyleDownArrow}>
        <SvgArrow width={height} height={width} fill={fill} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrow;
