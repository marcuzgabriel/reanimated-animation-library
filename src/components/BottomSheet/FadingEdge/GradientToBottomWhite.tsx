import React from 'react';
import Svg, { G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  height: number;
  width: number | string;
  viewBox: string;
  stopColor?: string;
}

/* NOTE: Type satisfaction: Undefined allowance from a user configuration perspective
but will always be defined in the default config: containers/UserConfigurationProvider.tsx */
const svgConfig = (stopColor?: string): Record<string, React.ReactElement> => ({
  svg: (
    <G>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={stopColor} stopOpacity="0" />
          <Stop offset="50%" stopColor={stopColor} stopOpacity="0.65" />
          <Stop offset="75%" stopColor={stopColor} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={stopColor} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#gradient)" x="0" y="0" width="100%" height="100%" />
    </G>
  ),
});

const GradientToBottomWhite: React.FC<Props> = ({ height, width, stopColor, viewBox }) => (
  <Svg height={height} width={width} viewBox={viewBox}>
    {svgConfig(stopColor).svg}
  </Svg>
);

export default GradientToBottomWhite;
