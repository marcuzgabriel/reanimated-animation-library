import React, { useMemo, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { createPath, addCurve, interpolatePath } from 'react-native-redash';
import Svg, { Path } from 'react-native-svg';
import SvgArrowStraight from './SvgArrowStraight';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

const START_Y = 30;
const X_OFFSET = 25;
const Y_OFFSET = 15;
const EDGE_OFFSET = 5;

const STATIC_ARROW_WIDTH = 100;
const STATIC_ARROW_HEIGHT = 50;

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

interface Props {
  scrollY?: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const MorphingArrow: React.FC<Props> = ({ snapPointBottom }) => {
  const windowWidth = useWindowDimensions().width;

  const { morphingArrow } = useContext(UserConfigurationContext);
  const { translationY } = useContext(ReusablePropsContext.bottomSheet);

  const fill = useMemo(() => morphingArrow?.fill ?? 'white', [morphingArrow?.fill]);
  const height = useMemo(() => STATIC_ARROW_HEIGHT, []);
  const width = useMemo(() => STATIC_ARROW_WIDTH, []);

  const animatedProps = useAnimatedProps(() => {
    const startX = windowWidth / 2;

    const upArrow = createPath({ x: startX - X_OFFSET, y: START_Y });
    addCurve(upArrow, {
      to: { x: startX + X_OFFSET, y: START_Y },
      c1: { x: startX + EDGE_OFFSET, y: Y_OFFSET },
      c2: { x: startX - EDGE_OFFSET, y: Y_OFFSET },
    });

    const straightArrow = createPath({ x: startX - X_OFFSET, y: START_Y });
    addCurve(straightArrow, {
      to: { x: startX + X_OFFSET, y: START_Y },
      c1: { x: startX - X_OFFSET, y: START_Y },
      c2: { x: startX + X_OFFSET, y: START_Y },
    });

    return {
      d: interpolatePath(translationY.value, [0, snapPointBottom.value], [straightArrow, upArrow]),
    };
  }, [windowWidth]);

  return (
    <Wrapper>
      {morphingArrow?.isEnabled ? (
        <Svg width="100%" height="100%">
          <AnimatedPath
            animatedProps={animatedProps}
            stroke={fill}
            fill="none"
            fillRule="evenodd"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </Svg>
      ) : (
        <SvgArrowStraight fill={fill} height={height} width={width} />
      )}
    </Wrapper>
  );
};

export default MorphingArrow;
