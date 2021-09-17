import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import GradientToTopWhite from './GradientToTopWhite';
import GradientToBottomWhite from './GradientToBottomWhite';

const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';

const FADING_EDGE_HEIGHT = 10;

interface Props {
  position: string;
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  scrollViewWidth: Animated.SharedValue<number>;
  isScrollable: Animated.SharedValue<boolean>;
  isFocusInputFieldAnimationRunning: Animated.SharedValue<boolean>;
  nativeColor?: string;
  webColor?: Record<string, string>;
}

/* NOTE: webColor -> type satisfaction: Undefined allowance from a user configuration perspective
but will always be defined in the default config: containers/UserConfigurationProvider.tsx */
const Wrapper = Animated.createAnimatedComponent(styled.View<{
  position: string;
  webColor?: Record<string, string>;
}>`
  position: absolute;
  justify-content: center;
  align-items: center;
  height: ${FADING_EDGE_HEIGHT}px;
  width: 100%;
  z-index: 3;
  ${({ webColor }): string =>
    isWeb ? `background-image: linear-gradient(${webColor?.from}, ${webColor?.to});` : ``}
  ${({ position }): string => (position === 'top' ? `top: 0px;` : `bottom: 0px`)}
`);

const FadingEdge: React.FC<Props> = ({
  position,
  nativeColor,
  webColor,
  scrollViewWidth,
  isScrollable,
  isScrolledToTop,
  isScrolledToEnd,
  isFocusInputFieldAnimationRunning,
}) => {
  const isPositionedTop = position === 'top';
  const animatedValueIsPositionedTop = useSharedValue(isPositionedTop);

  const animatedDisplayStyle = useDerivedValue(() => {
    if (!isFocusInputFieldAnimationRunning.value) {
      if (animatedValueIsPositionedTop.value && isScrollable.value) {
        if (isScrolledToTop.value) {
          return 'none';
        } else {
          return 'flex';
        }
      } else if (isScrollable.value) {
        if (isScrolledToEnd.value) {
          return 'none';
        } else {
          return 'flex';
        }
      }
    }

    return 'none';
  }, [
    isScrolledToTop,
    isFocusInputFieldAnimationRunning,
    isScrolledToEnd,
    animatedValueIsPositionedTop,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    display: animatedDisplayStyle.value,
  }));

  return (
    <Wrapper position={position} webColor={webColor} style={animatedStyle}>
      {isIOS && isPositionedTop && (
        <GradientToTopWhite
          stopColor={nativeColor}
          height={FADING_EDGE_HEIGHT}
          width={scrollViewWidth}
        />
      )}
      {isIOS && !isPositionedTop && (
        <GradientToBottomWhite
          stopColor={nativeColor}
          height={FADING_EDGE_HEIGHT}
          width={scrollViewWidth}
        />
      )}
    </Wrapper>
  );
};

export default FadingEdge;
