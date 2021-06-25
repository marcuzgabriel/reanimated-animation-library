import React, { useMemo, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
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
import type {
  MixedScrollViewProps,
  ScrollProps,
  OnScrollArrowAppearanceReaction,
} from '../../../types';
import {
  SCROLL_ARROW_FILL,
  SCROLL_ARROW_DIMENSIONS,
  SCROLL_ARROW_OFFSET,
} from '../../../constants/styles';

const SVG_ARROW_ROTATION = 90;

interface Props extends Pick<MixedScrollViewProps, 'scrollArrows'>, ScrollProps {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  position: string;
  contextName: string;
  component?: React.ReactNode;
  isInputFieldFocused: Animated.SharedValue<boolean>;
}

interface ContextProps extends Partial<Props> {
  contextName: string;
  position: string;
  isInputFieldFocused: Animated.SharedValue<boolean>;
}

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

const ScrollArrowDefault: React.FC<Props | ContextProps> = props => {
  const { contextName, position, isInputFieldFocused, component } = props;

  const isContextNameBottomSheet = useMemo(() => contextName === 'bottomSheet', [contextName]);
  const reusablePropsContextBottomSheet = useContext(ReusablePropsContext.bottomSheet);
  const userConfigurationContext = useContext(UserConfigurationContext);

  const {
    scrollViewRef,
    scrollViewHeight,
    scrollViewWidth,
    contentHeight,
    scrollY,
    scrollingLength,
    isScrolledToTop,
    isScrolledToEnd,
    isScrollable,
  } = isContextNameBottomSheet ? reusablePropsContextBottomSheet : props;
  const { scrollArrows } = isContextNameBottomSheet ? userConfigurationContext : props;
  const { fill, dimensions, topArrowOffset, bottomArrowOffset } = scrollArrows ?? {};

  const opacityInterpolationUpArrow = useSharedValue(ARROW_UP_OFFSET);
  const opacityInterpolationDownArrow = useSharedValue(ARROW_DOWN_OFFSET);
  const isUpArrowTouchable = useSharedValue(false);
  const isDownArrowTouchable = useSharedValue(true);
  const currentWindowHeight = useSharedValue(0);

  const arrowFill = useMemo(() => fill ?? SCROLL_ARROW_FILL, [fill]);
  const arrowDimensions = useMemo(() => dimensions ?? SCROLL_ARROW_DIMENSIONS, [dimensions]);
  const arrowTopOffset = useMemo(() => topArrowOffset ?? SCROLL_ARROW_OFFSET, [topArrowOffset]);
  const arrowBottomOffset = useMemo(
    () => bottomArrowOffset ?? SCROLL_ARROW_OFFSET,
    [bottomArrowOffset],
  );

  const isPositionedTop = useMemo(() => position === 'top', [position]);

  const scrollArrowLeftRatio = useDerivedValue(() => {
    const centerAlignedScrollArrowRatio = arrowDimensions / 2;
    return 50 - (centerAlignedScrollArrowRatio / scrollViewWidth.value) * 100;
  }, [arrowDimensions, scrollViewWidth]);

  useAnimatedReaction(
    () => ({
      contentHeight,
      scrollViewHeight,
      scrollY,
      isInputFieldFocused,
    }),
    (
      result: OnScrollArrowAppearanceReaction,
      _previous: OnScrollArrowAppearanceReaction | null | undefined,
    ) => {
      if (result.contentHeight?.value > 0 && result.scrollViewHeight?.value > 0) {
        onScrollArrowAppearanceReaction({
          result,
          contentHeight,
          opacityInterpolationUpArrow,
          opacityInterpolationDownArrow,
          scrollViewHeight,
          scrollingLength,
          isScrolledToTop,
          isScrolledToEnd,
          isScrollable,
          isInputFieldFocused,
          isUpArrowTouchable,
          isDownArrowTouchable,
        });
      }
    },
    [scrollY, contentHeight, scrollViewHeight, isInputFieldFocused],
  );

  const animatedStyleUpArrow = useAnimatedStyle(() => ({
    opacity: interpolate(opacityInterpolationUpArrow.value, [ARROW_UP_OFFSET, 0], [0, 1]),
  }));

  const animatedStyleDownArrow = useAnimatedStyle(() => ({
    opacity: interpolate(opacityInterpolationDownArrow.value, [0, ARROW_DOWN_OFFSET], [1, 0]),
  }));

  const { height: windowHeight } = useWindowDimensions();

  /* NOTE: Reset behaviour of arrow animations when rotation occours */
  useDerivedValue(() => {
    if (windowHeight !== currentWindowHeight.value) {
      currentWindowHeight.value = windowHeight;
      opacityInterpolationDownArrow.value = ARROW_DOWN_OFFSET;
      opacityInterpolationUpArrow.value = ARROW_UP_OFFSET;
    }
  }, [windowHeight, currentWindowHeight, opacityInterpolationDownArrow]);

  const zIndexUpArrow = useDerivedValue(
    () => opacityInterpolationUpArrow.value === ARROW_UP_OFFSET,
    [opacityInterpolationDownArrow],
  );

  const zIndexDownArrow = useDerivedValue(
    () => opacityInterpolationDownArrow.value === ARROW_DOWN_OFFSET,
    [opacityInterpolationDownArrow],
  );

  const animatedStyleTouchableOpacity = useAnimatedStyle(
    () =>
      isPositionedTop
        ? {
            left: `${scrollArrowLeftRatio.value}%`,
            zIndex: zIndexUpArrow.value ? -1 : 4,
          }
        : {
            left: `${scrollArrowLeftRatio.value}%`,
            zIndex: zIndexDownArrow.value ? -1 : 4,
          },
    [contentHeight],
  );

  return (
    <TouchableOpacity
      position={position}
      topOffset={arrowTopOffset}
      bottomOffset={arrowBottomOffset}
      style={animatedStyleTouchableOpacity}
      onPress={(): void => {
        scrollToHelper({ ref: scrollViewRef, to: isPositionedTop ? 'top' : 'end' });
      }}
    >
      <Animated.View style={isPositionedTop ? animatedStyleUpArrow : animatedStyleDownArrow}>
        {component ?? (
          <SvgArrowWrapper rotation={isPositionedTop ? -SVG_ARROW_ROTATION : SVG_ARROW_ROTATION}>
            <SvgArrow height={arrowDimensions} width={arrowDimensions} fill={arrowFill} />
          </SvgArrowWrapper>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScrollArrowDefault;
