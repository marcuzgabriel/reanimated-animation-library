import React, { useCallback, useContext } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { onPanGestureHitFooterReaction } from '../../../worklets';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import { KeyboardContext } from '../../../containers/KeyboardProvider';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

interface FooterProps {
  hideFooterInterpolation: Animated.SharedValue<number>;
}

const ComponentWhenUndefined = styled.View`
  height: 100px;
  width: 100%;
  background: black;
  justify-content: center;
  align-items: center;
`;

const TextWhenUndefined = styled.Text`
  color: white;
`;

const TouchableOpacity = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background: white;
`;

const ParentWrapper = Animated.createAnimatedComponent(styled.View``);
const ChildWrapper = Animated.View;

const Footer: React.FC<FooterProps> = ({ hideFooterInterpolation }) => {
  const { isKeyboardVisible } = useContext(KeyboardContext);
  const { footerComponent, extraSnapPointBottomOffset, hideFooterOnCardCollapse, header } =
    useContext(UserConfigurationContext);
  const {
    cardHeight,
    headerHeight: headerHeightLayout,
    footerHeight,
    translationY,
    footerTranslationY,
  } = useContext(ReusablePropsContext.bottomSheet);

  const headerHeight = useDerivedValue(
    () => header?.height ?? headerHeightLayout.value,
    [headerHeightLayout, header],
  );

  const animatedParentStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      position: 'absolute',
      width: '100%',
      zIndex: 3,
      bottom: -footerTranslationY.value,
    }),
  );

  const animatedChildStyle = useAnimatedStyle(
    (): Animated.AnimatedStyleProp<ViewStyle> => ({
      opacity: hideFooterOnCardCollapse?.isEnabled
        ? interpolate(hideFooterInterpolation.value, [0, HIDE_CONTENT_OUTPUT_RANGE], [1, 0])
        : 1,
    }),
  );

  useAnimatedReaction(
    () => translationY.value,
    (result: number, previous: number | null | undefined) => {
      onPanGestureHitFooterReaction({
        result,
        previous,
        translationY,
        footerTranslationY,
        cardHeight,
        isKeyboardVisible,
        headerHeight,
        footerHeight,
        extraSnapPointBottomOffset,
      });
    },
    [translationY.value, cardHeight, headerHeight, footerHeight, isKeyboardVisible],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        footerHeight.value = e.nativeEvent.layout.height;
      }
    },
    [footerHeight],
  );

  return (
    <ParentWrapper onLayout={onLayout} style={animatedParentStyle}>
      <ChildWrapper style={animatedChildStyle}>
        {footerComponent ?? (
          <ComponentWhenUndefined>
            <TouchableOpacity />
            <TextWhenUndefined>Footer component</TextWhenUndefined>
          </ComponentWhenUndefined>
        )}
      </ChildWrapper>
    </ParentWrapper>
  );
};

export default Footer;
