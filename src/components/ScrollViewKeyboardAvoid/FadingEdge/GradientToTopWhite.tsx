import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { GWithChildrenProps, LinearGradientWithChildrenProps } from '../../../types';

const SvgG: React.ComponentClass<GWithChildrenProps> = G;
const SvgLinearGradient: React.ComponentClass<LinearGradientWithChildrenProps> = LinearGradient;

interface Props {
  height: number;
  width: Animated.SharedValue<number>;
  stopColor?: string;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

/* NOTE: stopColor -> type satisfaction: Undefined allowance from a user configuration perspective
but will always be defined in the default config: containers/UserConfigurationProvider.tsx */
const svgConfig = (stopColor?: string): Record<string, React.ReactElement> => ({
  svg: (
    <SvgG>
      <Defs>
        <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="100%" stopColor={stopColor} stopOpacity="0" />
          <Stop offset="50%" stopColor={stopColor} stopOpacity="0.65" />
          <Stop offset="25%" stopColor={stopColor} stopOpacity="0.8" />
          <Stop offset="0%" stopColor={stopColor} stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      <Rect fill="url(#gradient)" x="0" y="0" width="100%" height="100%" />
    </SvgG>
  ),
});

const GradientToTopWhite: React.FC<Props> = ({ height, width, stopColor }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    height,
    width: width.value,
  }));

  return <AnimatedSvg style={animatedStyle}>{svgConfig(stopColor).svg}</AnimatedSvg>;
};

export default GradientToTopWhite;
