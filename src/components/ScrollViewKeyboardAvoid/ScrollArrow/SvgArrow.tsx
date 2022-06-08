import React from 'react';
import Svg, { G, Circle, Path } from 'react-native-svg';
import type { GWithChildrenProps } from '../../../types';

const SvgG: React.ComponentClass<GWithChildrenProps> = G;

interface Props {
  height?: number;
  width?: number;
  fill?: string;
}

const arrowInCircle = {
  svg: (
    <SvgG transform="matrix(-1 0 0 1 40 0)">
      <Circle cx="20" cy="20" r="20" />
      <Path
        d="M17.507 19.937l4.932-4.764-1.19-1.233-4.933 4.763-1.233 1.191 5.954 6.166 1.233-1.19-4.763-4.933z"
        fill="#FFF"
      />
    </SvgG>
  ),
  viewBox: '0 0 40 40',
};

const SvgArrow: React.FC<Props> = ({ height, width, fill }) => (
  <Svg height={height} width={width} viewBox={arrowInCircle.viewBox}>
    {React.cloneElement(arrowInCircle.svg, {
      fill,
    })}
  </Svg>
);

export default SvgArrow;
