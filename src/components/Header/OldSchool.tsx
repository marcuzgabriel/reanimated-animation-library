import React from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  HIT_SLOP,
} from '../../constants/styles';
import MorphingArrow from '../MorphingArrow/OldSchool';
import { DEFAULT_SNAP_POINT_BOTTOM_RATIO } from '../../constants/animations';

interface Props {
  cardHeight: Animated.Value<number>;
  scrollY: Animated.SharedValue<number>;
  isAnimationRunning: Animated.Value<number>;
  isCardCollapsed: Animated.Value<number>;
  translationY: Animated.Value<number>;
}

const TouchableOpacity = styled.TouchableOpacity`
  display: flex;
  border: 1px solid orange;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background: grey;
`;

const HitSlopAreaWrapper = styled.View`
  background: transparent;
  top: -${CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
  height: ${CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
  width: 100%;
`;

const MorphingArrowWrapper = styled.View`
  width: 100%;
  height: ${CLOSE_CARD_BUTTON_HEIGHT}px;
  top: -${CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
`;

const { block, call } = Animated;

const Header: React.FC<Props> = ({ cardHeight, scrollY, translationY }) => {
  const transformTranslationYToSharedValue = useSharedValue(0);
  const snapPointToBottom = useSharedValue(0);

  const runAnimationCode = (): any =>
    block([
      call([cardHeight, translationY], vals => {
        transformTranslationYToSharedValue.value = vals[1];
        snapPointToBottom.value = vals[0] * DEFAULT_SNAP_POINT_BOTTOM_RATIO;
      }),
    ]);

  return (
    <Animated.View>
      <Animated.Code>{runAnimationCode()}</Animated.Code>
      <TouchableOpacity activeOpacity={1} hitSlop={HIT_SLOP}>
        <HitSlopAreaWrapper />
        <MorphingArrowWrapper>
          <MorphingArrow
            snapPointBottom={snapPointToBottom}
            scrollY={scrollY}
            translationY={transformTranslationYToSharedValue}
          />
        </MorphingArrowWrapper>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Header;
