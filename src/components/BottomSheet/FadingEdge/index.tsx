import React, { useContext } from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { ReusablePropsContext } from 'containers/ReusablePropsProvider';
import GradientToTopWhite from './GradientToTopWhite';

const FADING_EDGE_HEIGHT = 15;

interface Props {
  direction: string;
}

const Wrapper = Animated.createAnimatedComponent(styled.View<{ direction: string }>`
  position: absolute;
  justify-content: center;
  align-items: center;
  height: ${FADING_EDGE_HEIGHT}px;
  width: 100%;
  z-index: 4;
  background-image: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.1));
  ${({ direction }): string => (direction === 'up' ? `top: 0px;` : `bottom: 0px`)}
`);

const FadingEdge: React.FC<Props> = ({ direction }) => {
  const { isScrollable, isScrolledToTop, isScrolledToEnd, windowWidth } =
    useContext(ReusablePropsContext);

  const animatedStyleTop = useAnimatedStyle(() => ({
    display: !isScrolledToTop.value ? 'flex' : 'none',
  }));

  // const animatedStyleBottom = useAnimatedStyle(() => ({}));

  return (
    <Wrapper direction={direction} style={animatedStyleTop}>
      {direction === 'up' && (
        <GradientToTopWhite
          height={FADING_EDGE_HEIGHT}
          width={windowWidth}
          viewBox={`0 0 ${windowWidth} ${FADING_EDGE_HEIGHT}`}
        />
      )}
    </Wrapper>
  );
};

export default FadingEdge;
