import React, { useCallback } from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  CARD_BOTTOM_OFFSET,
  DEFAULT_CARD_HEIGHT,
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_CARD_TOP_POSITION,
  HIT_SLOP,
} from '../../constants/styles';
import MorphingArrow from '../MorphingArrow';
import { getCardOnPressRequest } from '../../helpers/getCardOnPressRequest';

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: ${DEFAULT_CARD_HEIGHT}px;
  bottom: -${CARD_BOTTOM_OFFSET}px;
  background: black;
`;

const TouchableOpacity = styled.TouchableOpacity`
  top: -${CLOSE_CARD_TOP_POSITION}px;
  height: ${CLOSE_CARD_BUTTON_HEIGHT}px;
  width: 100%;
`;
interface Props {
  borderTopRadius?: number;
  isScrollingDown: Animated.SharedValue<number>;
  isScrollingUp: Animated.SharedValue<number>;
  isPanning: Animated.SharedValue<number>;
  isPanGestureAnimationRunning: Animated.SharedValue<number>;
  isCardCollapsed: Animated.SharedValue<number>;
  scrollY?: Animated.SharedValue<number>;
  translation: {
    y: Animated.SharedValue<number>;
  };
}

const Card: React.FC<Props> = ({
  isPanning,
  isCardCollapsed,
  isScrollingDown,
  isScrollingUp,
  scrollY,
  translation,
  isPanGestureAnimationRunning,
}) => {
  const latestPanValue = useDerivedValue(() => isPanning.value);
  const onCardPressRequest = useCallback(() => {
    getCardOnPressRequest({
      latestPanValue,
      translation,
      isPanGestureAnimationRunning,
      isCardCollapsed,
    });
  }, [isCardCollapsed, isPanGestureAnimationRunning, translation, latestPanValue]);

  return (
    <Wrapper>
      <TouchableOpacity activeOpacity={1} hitSlop={HIT_SLOP} onPress={onCardPressRequest}>
        <MorphingArrow scrollY={scrollY} translation={translation} />
      </TouchableOpacity>
    </Wrapper>
  );
};

export default Card;
