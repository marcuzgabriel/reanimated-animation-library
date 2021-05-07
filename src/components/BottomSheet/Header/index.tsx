import React, { useCallback } from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  DEFAULT_BORDER_RADIUS,
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  HIT_SLOP,
} from 'constants/styles';
import MorphingArrow from 'components/BottomSheet/MorphingArrow';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  onPress: () => void;
}

const TouchableOpacity = styled.TouchableOpacity`
  display: flex;
  border-top-right-radius: ${DEFAULT_BORDER_RADIUS}px;
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS}px;
  z-index: 2;
  background: transparent;
  border-bottom-color: white;
  border-bottom-width: 1px;
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

const Header: React.FC<Props> = ({ snapPointBottom, scrollY, translationY, onPress }) => (
  <TouchableOpacity activeOpacity={1} hitSlop={HIT_SLOP} onPress={onPress}>
    <HitSlopAreaWrapper />
    <MorphingArrowWrapper>
      <MorphingArrow
        snapPointBottom={snapPointBottom}
        scrollY={scrollY}
        translationY={translationY}
      />
    </MorphingArrowWrapper>
  </TouchableOpacity>
);

export default Header;
