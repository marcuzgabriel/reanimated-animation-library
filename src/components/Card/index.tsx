import React, { useCallback } from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  DEFAULT_CARD_HEIGHT,
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  HIT_SLOP,
} from '../../constants/styles';
import MorphingArrow from '../MorphingArrow';
import { onPressRequestCloseOrOpenCard } from '../../worklets/onPressRequestCloseOrOpenCard';
import Content from '../Content';

const Wrapper = styled.View`
  position: relative;
  width: 100%;
  height: ${DEFAULT_CARD_HEIGHT}px;
`;

/* TouchableWithoutFeedback is not possible to use when it has
multiple childrens. A workaround is therefore TouchableOpacity
where activeOpacity is set to 1 while at the same time having
a little offset fix that eliminates white space. */
const TouchableOpacity = styled.TouchableOpacity`
  display: flex;
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

interface Props {
  borderTopRadius?: number;
  snapPointBottom: Animated.SharedValue<number>;
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
  snapPointBottom,
  isCardCollapsed,
  scrollY,
  translation,
  isPanGestureAnimationRunning,
}) => {
  const derivedIsCollapsed = useDerivedValue(() => isCardCollapsed.value);

  const onCardPressRequest = useCallback(() => {
    onPressRequestCloseOrOpenCard({
      translation,
      isPanGestureAnimationRunning,
      derivedIsCollapsed,
      isCardCollapsed,
      snapPointBottom,
    });
  }, [
    isCardCollapsed,
    isPanGestureAnimationRunning,
    snapPointBottom,
    translation,
    derivedIsCollapsed,
  ]);

  return (
    <>
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
      <Wrapper>
        <Content />
      </Wrapper>
    </>
  );
};

export default Card;
