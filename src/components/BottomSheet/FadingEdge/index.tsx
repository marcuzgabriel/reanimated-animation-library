import React, { useMemo, useContext } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import GradientToTopWhite from './GradientToTopWhite';
import GradientToBottomWhite from './GradientToBottomWhite';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';

const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';

const FADING_EDGE_HEIGHT = 10;

interface Props {
  position: string;
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

const FadingEdge: React.FC<Props> = ({ position, nativeColor, webColor }) => {
  const { isScrolledToTop, isScrolledToEnd, windowWidth } = useContext(ReusablePropsContext);
  const isPositionedTop = useMemo(() => position === 'top', [position]);

  const animatedStyleTop = useAnimatedStyle(() => ({
    display: !isScrolledToTop.value ? 'flex' : 'none',
  }));

  const animatedStyleBottom = useAnimatedStyle(() => ({
    display: !isScrolledToEnd.value ? 'flex' : 'none',
  }));

  return (
    <Wrapper
      position={position}
      webColor={webColor}
      style={isPositionedTop ? animatedStyleTop : animatedStyleBottom}
    >
      {isIOS && isPositionedTop && (
        <GradientToTopWhite
          stopColor={nativeColor}
          height={FADING_EDGE_HEIGHT}
          width={windowWidth}
          viewBox={`0 0 ${windowWidth} ${FADING_EDGE_HEIGHT}`}
        />
      )}
      {isIOS && !isPositionedTop && (
        <GradientToBottomWhite
          stopColor={nativeColor}
          height={FADING_EDGE_HEIGHT}
          width={windowWidth}
          viewBox={`0 0 ${windowWidth} ${FADING_EDGE_HEIGHT}`}
        />
      )}
    </Wrapper>
  );
};

export default FadingEdge;
