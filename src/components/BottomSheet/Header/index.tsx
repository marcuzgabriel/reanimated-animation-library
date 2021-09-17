import React, { useMemo, useCallback, useContext } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  MORPHING_ARROW_OFFSET,
  HEADER_HEIGHT,
  HIT_SLOP,
} from '../../../constants/styles';
import MorphingArrow from '../../../components/BottomSheet/MorphingArrow';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  scrollY?: Animated.SharedValue<number>;
  onPress: () => void;
}

const TouchableOpacity = styled.TouchableOpacity<{
  borderTopRightRadius?: number;
  borderTopLeftRadius?: number;
  height: number;
}>`
  display: flex;
  z-index: 2;
  background: transparent;
  height: ${({ height }): number => height}px;
`;

const HitSlopAreaWrapper = styled.View`
  background: transparent;
  top: -${CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
  height: ${CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
  width: 100%;
`;

const MorphingArrowWrapper = styled.View<{ offset: number }>`
  width: 100%;
  height: ${CLOSE_CARD_BUTTON_HEIGHT}px;
  top: ${({ offset }): string => `-${offset}`}px;
`;

const Wrapper = styled.View``;

const Header: React.FC<Props> = ({ snapPointBottom, scrollY, onPress }) => {
  const { headerComponent, header, morphingArrow } = useContext(UserConfigurationContext);
  const { headerHeight } = useContext(ReusablePropsContext.bottomSheet);

  const offset = useMemo(() => morphingArrow?.offset ?? MORPHING_ARROW_OFFSET, [morphingArrow]);
  const height = useMemo(() => header?.height ?? HEADER_HEIGHT, [header]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        headerHeight.value = e.nativeEvent.layout.height;
      }
    },
    [headerHeight],
  );

  return (
    <TouchableOpacity height={height} activeOpacity={1} hitSlop={HIT_SLOP} onPress={onPress}>
      <HitSlopAreaWrapper />
      <Wrapper onLayout={onLayout}>
        {headerComponent ?? (
          <MorphingArrowWrapper offset={offset}>
            <MorphingArrow snapPointBottom={snapPointBottom} scrollY={scrollY} />
          </MorphingArrowWrapper>
        )}
      </Wrapper>
    </TouchableOpacity>
  );
};

export default Header;
