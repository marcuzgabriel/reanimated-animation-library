import React, { useMemo, useContext } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { onScrollArrowAppearanceReaction } from '../../../worklets';
import { scrollTo as scrollToHelper } from '../../../helpers';
import { ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../../../constants/animations';
import type { MixedScrollViewProps, ScrollProps } from '../../../types';
import { useWindowDimensions } from 'react-native';

interface Props extends Pick<MixedScrollViewProps, 'contentHeight' | 'scrollArrows'>, ScrollProps {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  position: string;
  contextName: string;
  component?: React.ReactNode;
}

interface ContextProps extends Partial<Props> {
  contextName: string;
  position: string;
}

const TouchableOpacity = Animated.createAnimatedComponent(styled.TouchableOpacity<{
  position: string;
  topOffset: number;
  bottomOffset: number;
}>`
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 4;
  width: 100%;
  ${({ position, topOffset, bottomOffset }): string =>
    position === 'top' ? `top: ${topOffset}px` : `bottom: ${bottomOffset}px`}
`);

const ScrollArrowDefault: React.FC<Props | ContextProps> = props => {
  const { contextName, position } = props;
  const isContextNameBottomSheet = useMemo(() => contextName === 'bottomSheet', [contextName]);
  const reusablePropsContextBottomSheet = useContext(ReusablePropsContext.bottomSheet);
  const userConfigurationContext = useContext(UserConfigurationContext);

  const {
    scrollViewRef,
    scrollViewHeight,
    contentHeight,
    scrollY,
    scrollingLength,
    isScrolledToTop,
    isScrolledToEnd,
    isScrollable,
  } = isContextNameBottomSheet ? reusablePropsContextBottomSheet : props;
  const { scrollArrows } = isContextNameBottomSheet ? userConfigurationContext : props;

  const isPositionedTop = useMemo(() => position === 'top', [position]);
  const translationYUpArrow = useSharedValue(ARROW_UP_OFFSET);
  const translationYDownArrow = useSharedValue(ARROW_DOWN_OFFSET);

  useAnimatedReaction(
    () => ({
      contentHeight,
      scrollViewHeight,
      scrollY,
    }),
    (
      result: Record<string, Animated.SharedValue<number>>,
      _previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) => {
      if (result.contentHeight?.value > 0 && result.scrollViewHeight?.value > 0) {
        onScrollArrowAppearanceReaction({
          result,
          contentHeight,
          translationYUpArrow,
          translationYDownArrow,
          scrollViewHeight,
          scrollingLength,
          isScrolledToTop,
          isScrolledToEnd,
          isScrollable,
        });
      }
    },
    [scrollY, contentHeight, scrollViewHeight],
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
      topOffset={scrollArrows?.isEnabled ? scrollArrows.topArrowOffset : 0}
      bottomOffset={scrollArrows?.isEnabled ? scrollArrows.bottomArrowOffset : 0}
      onPress={(): void => {
        scrollToHelper({ ref: scrollViewRef, to: isPositionedTop ? 'top' : 'end' });
      }}
    >
      <Animated.View style={isPositionedTop ? animatedStyleUpArrow : animatedStyleDownArrow}>
        {scrollArrows?.isEnabled && (
          <SvgArrow
            height={scrollArrows.dimensions}
            width={scrollArrows.dimensions}
            fill={scrollArrows.fill}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrowDefault;
