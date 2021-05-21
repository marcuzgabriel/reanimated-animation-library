import React, { useContext } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { ReusablePropsContext } from 'containers/ReusablePropsProvider';

const ROTATION = 90;
const BOTTOM_OFFSET = 5;

interface Props {
  height: number;
  width: number;
  direction: string;
  fill: string;
}

const Wrapper = Animated.createAnimatedComponent(styled.TouchableOpacity<{
  type: string;
  offset: number;
  rotation: number;
}>`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 4;
  transform: ${({ rotation }): string => `rotate(${rotation}deg)`};
  ${({ type, offset }): string =>
    type === 'up' ? `top: ${-offset}px` : `bottom: ${BOTTOM_OFFSET}px`}
`);

const ScrollArrow: React.FC<Props> = ({ direction, height, width, fill }) => {
  const { scrollViewRef, innerScrollY, isScrollable } = useContext(ReusablePropsContext);

  const isUpArrowVisible = useSharedValue(false);
  const isDownArrowVisible = useSharedValue(false);

  return (
    <Wrapper
      type={direction}
      rotation={direction === 'up' ? -ROTATION : ROTATION}
      offset={height / 2}
    >
      <SvgArrow width={height} height={width} fill={fill} />
    </Wrapper>
  );
};

export default ScrollArrow;
