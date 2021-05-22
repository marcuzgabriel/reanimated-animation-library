import React from 'react';
import Svg, { G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  height: number;
  width: number | string;
  viewBox: string;
}

const svgConfig = {
  svg: (
    <G>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
          <Stop offset="50%" stopColor="white" stopOpacity="1" />
          <Stop offset="0%" stopColor="white" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#gradient)" x="0" y="0" width="100%" height="100%" />
    </G>
  ),
};

const GradientToTopWhite: React.FC<Props> = ({ height, width, viewBox }) => (
  <Svg height={height} width={width} viewBox={viewBox}>
    {svgConfig.svg}
  </Svg>
);

export default GradientToTopWhite;
