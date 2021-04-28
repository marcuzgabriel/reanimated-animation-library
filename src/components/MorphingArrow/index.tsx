import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { createPath, addCurve, interpolatePath } from 'react-native-redash';
import Svg, { Path } from 'react-native-svg';

const START_Y = 30;
const X_OFFSET = 25;
const Y_OFFSET = 15;
const EDGE_OFFSET = 5;

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface Props {
  scrollY?: Animated.SharedValue<number>;
  snapPointBottom: Animated.SharedValue<number>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const MorphingArrow: React.FC<Props> = ({ translation, snapPointBottom }) => {
  const windowWidth = useWindowDimensions().width;

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
      d: interpolatePath(translation.y.value, [0, snapPointBottom.value], [straightArrow, upArrow]),
    };
  }, [windowWidth]);

  return (
    <Wrapper>
      <Svg>
        <AnimatedPath
          animatedProps={animatedProps}
          fill="none"
          fillRule="evenodd"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </Svg>
    </Wrapper>
  );
};

export default MorphingArrow;
