import React, { useCallback } from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  HIT_SLOP,
} from '../../constants/styles';
import MorphingArrow from '../MorphingArrow';
import { onPressRequestCloseOrOpenCard } from '../../worklets/onPressRequestCloseOrOpenCard';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

const TouchableOpacity = styled.TouchableOpacity`
  display: flex;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background: transparent;
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

const Header: React.FC<Props> = ({
  snapPointBottom,
  scrollY,
  translation,
  isAnimationRunning,
  isCardCollapsed,
}) => {
  const derivedIsCollapsed = useDerivedValue(() => isCardCollapsed.value);

  const onCardPressRequest = useCallback(() => {
    onPressRequestCloseOrOpenCard({
      translation,
      isAnimationRunning,
      derivedIsCollapsed,
      isCardCollapsed,
      snapPointBottom,
    });
  }, [isCardCollapsed, isAnimationRunning, snapPointBottom, translation, derivedIsCollapsed]);

  return (
    <TouchableOpacity activeOpacity={1} hitSlop={HIT_SLOP} onPress={onCardPressRequest}>
      <HitSlopAreaWrapper />
      <MorphingArrowWrapper>
        <MorphingArrow
          snapPointBottom={snapPointBottom}
          scrollY={scrollY}
          translation={translation}
        />
      </MorphingArrowWrapper>
    </TouchableOpacity>
  );
};

export default Header;
