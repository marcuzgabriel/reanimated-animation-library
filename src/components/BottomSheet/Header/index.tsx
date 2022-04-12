import React, { useCallback, useContext } from 'react';
import { LayoutChangeEvent, Platform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import styled from 'styled-components/native';
import CloseIcon from './CloseIcon';
import {
  CLOSE_CARD_BUTTON_HEIGHT,
  CLOSE_OPEN_CARD_BUTTON_HITSLOP,
  DEFAULT_BORDER_RADIUS,
  MORPHING_ARROW_OFFSET,
  HEADER_HEIGHT,
} from '../../../constants/styles';
import MorphingArrow from '../../../components/BottomSheet/MorphingArrow';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

const isWeb = Platform.OS === 'web';
const SHADOW_WRAPPER_HEIGHT = 16;
const SHADOW_WRAPPER_OPACITY = 0.65;
const SHADOW_WRAPPER_OFFSET = 10;

interface Props {
  snapPointBottom: Animated.SharedValue<number>;
  scrollY?: Animated.SharedValue<number>;
  onPress: () => void;
}

const TouchableOpacity = styled.TouchableOpacity<{
  height: number;
  pressableSafeAreaToContent?: number;
}>`
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 2;
  top: -${({ pressableSafeAreaToContent }): number => pressableSafeAreaToContent ?? CLOSE_OPEN_CARD_BUTTON_HITSLOP}px;
  height: ${({ height }): number => height}px;
  background-color: transparent;
`;

const MorphingArrowWrapper = styled.View<{ offset: number }>`
  width: 100%;
  height: ${CLOSE_CARD_BUTTON_HEIGHT}px;
  top: ${({ offset }): string => `-${offset}`}px;
`;

const ShadowWrapper = styled.View<{ boxShadow: string }>`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: ${SHADOW_WRAPPER_HEIGHT}px;
  border-top-right-radius: ${DEFAULT_BORDER_RADIUS}px;
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS}px;
  box-shadow: ${({ boxShadow }): string => boxShadow};
`;

const Wrapper = styled.View<{ height: number; backgroundColor?: string }>`
  z-index: 1;
  height: ${({ height }): number => height}px;
  background-color: ${({ backgroundColor }): string => backgroundColor ?? 'lightgrey'};
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS}px;
  border-top-right-radius: ${DEFAULT_BORDER_RADIUS}px;
`;

const Header: React.FC<Props> = ({ snapPointBottom, scrollY, onPress }) => {
  const {
    headerComponent,
    backgroundColor,
    header,
    morphingArrow,
    contentHeightWhenKeyboardIsVisible,
    webBoxShadow,
    pressableSafeAreaToContent,
  } = useContext(UserConfigurationContext);
  const { headerHeight, isKeyboardVisible } = useContext(ReusablePropsContext.bottomSheet);

  const offset = morphingArrow?.offset ?? MORPHING_ARROW_OFFSET;
  const height = header?.height ?? HEADER_HEIGHT;
  const shadowOffset = webBoxShadow?.offset ?? SHADOW_WRAPPER_OFFSET;
  const shadowOpacity = webBoxShadow?.opacity ?? SHADOW_WRAPPER_OPACITY;
  const boxShadow =
    Object.keys(webBoxShadow ?? {}).length > 0
      ? `0px 3px ${shadowOffset}px rgba(0, 0, 0, ${shadowOpacity})`
      : 'none';

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        headerHeight.value = e.nativeEvent.layout.height;
      }
    },
    [headerHeight],
  );

  const animatedStyleWhenKeyboardIsVisible = useAnimatedStyle(() => ({
    transform: [{ scale: isKeyboardVisible?.value ? 1 : 0 }],
  }));

  const { takeUpAllAvailableSpace, closeIcon } = contentHeightWhenKeyboardIsVisible ?? {};
  const hasCloseIcon = takeUpAllAvailableSpace && closeIcon;

  const animatedStyleWhenKeyboardIsHidden = useAnimatedStyle(() => ({
    transform: [{ scale: isKeyboardVisible?.value && hasCloseIcon ? 0 : 1 }],
  }));

  return (
    <>
      <TouchableOpacity
        pressableSafeAreaToContent={pressableSafeAreaToContent}
        height={height}
        activeOpacity={1}
        onPress={onPress}
      />
      <Wrapper onLayout={onLayout} height={height} backgroundColor={backgroundColor}>
        {hasCloseIcon && (
          <Animated.View style={animatedStyleWhenKeyboardIsVisible}>
            <CloseIcon onPress={onPress} />
          </Animated.View>
        )}
        <Animated.View style={animatedStyleWhenKeyboardIsHidden}>
          {headerComponent ?? (
            <MorphingArrowWrapper offset={offset}>
              <MorphingArrow snapPointBottom={snapPointBottom} scrollY={scrollY} />
            </MorphingArrowWrapper>
          )}
        </Animated.View>
      </Wrapper>
      {isWeb && <ShadowWrapper boxShadow={boxShadow} />}
    </>
  );
};

export default Header;
