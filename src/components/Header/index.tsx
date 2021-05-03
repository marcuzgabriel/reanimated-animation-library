import React, { useCallback } from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  DEFAULT_BORDER_RADIUS,
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  HIT_SLOP,
} from 'constants/styles';
import MorphingArrow from 'components/MorphingArrow';
import { onPressRequestCloseOrOpenCard } from 'worklets';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  isAnimationRunning: Animated.SharedValue<boolean>;
  isCardCollapsed: Animated.SharedValue<boolean>;
  isPanning: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
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

const Header: React.FC<Props> = ({
  snapPointBottom,
  scrollY,
  translationY,
  isAnimationRunning,
  isCardCollapsed,
  isPanning,
}) => {
  const derivedIsCollapsed = useDerivedValue(() => isCardCollapsed.value);
  const derivedIsPanning = useDerivedValue(() => isPanning.value);

  const onCardPressRequest = useCallback(() => {
    onPressRequestCloseOrOpenCard({
      translationY,
      isAnimationRunning,
      derivedIsCollapsed,
      derivedIsPanning,
      isCardCollapsed,
      snapPointBottom,
    });
  }, [
    isCardCollapsed,
    isAnimationRunning,
    snapPointBottom,
    translationY,
    derivedIsPanning,
    derivedIsCollapsed,
  ]);

  return (
    <TouchableOpacity activeOpacity={1} hitSlop={HIT_SLOP} onPress={onCardPressRequest}>
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
};

export default Header;
