import React from 'react';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';

const ROTATION = 90;

interface Props {
  height: number;
  width: number;
  direction: string;
  fill: string;
}

const Wrapper = styled.View<{ top: number; direction: string }>`
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 3;
  width: 100%;
  transform: ${({ direction }): string =>
    `rotate(${direction === 'up' ? -ROTATION : ROTATION}deg)`};
  top: ${({ top }): number => -top}px;
`;

const ScrollArrow: React.FC<Props> = ({ direction, height, width, fill }) => (
  <Wrapper direction={direction} top={height / 2}>
    <SvgArrow width={height} height={width} fill={fill} />
  </Wrapper>
);

export default ScrollArrow;
