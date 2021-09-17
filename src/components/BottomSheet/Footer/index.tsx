import React, { useCallback, useContext } from 'react';
import { LayoutChangeEvent } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, interpolate, useDerivedValue } from 'react-native-reanimated';
import {
  EXTRA_MARGIN_WRAPPER_HEIGHT,
  DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD,
} from '../../../constants/styles';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

interface Props {
  isCardCollapsed: Animated.SharedValue<boolean>;
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

const ExtraMarginWrapper = Animated.View;
const Parentwrapper = Animated.View;
const ChildWrapper = Animated.View;

const Footer: React.FC<Props> = ({ isCardCollapsed }) => {
  const {
    footerComponent,
    extraSnapPointBottomOffset,
    hideFooterOnCardCollapse,
    header,
    contentResizeHeightTriggerOnFocusedInputField,
  } = useContext(UserConfigurationContext);

  const {
    contentHeight,
    cardHeight,
    headerHeight: headerHeightLayout,
    hideFooterInterpolation,
    footerHeight,
    translationY,
    footerTranslationY,
    isKeyboardVisible,
  } = useContext(ReusablePropsContext.bottomSheet);

  const headerHeight = useDerivedValue(
    () => header?.height ?? headerHeightLayout.value,
    [headerHeightLayout, header],
  );

  const hasExtraMargin = useDerivedValue(() => {
    const defaultContentResizeHeightTriggerOnFocusedInputField =
      contentResizeHeightTriggerOnFocusedInputField ??
      DEFAULT_CONTENT_RESIZE_HEIGHT_TRIGGER_ON_FOCUSED_INPUT_FIELD;

    return contentHeight.value >= defaultContentResizeHeightTriggerOnFocusedInputField;
  }, [contentHeight, contentResizeHeightTriggerOnFocusedInputField]);

  const derivedFooterTranslationY = useDerivedValue(() => {
    const areAllLayoutsCalculated =
      cardHeight.value > 0 && headerHeight.value > 0 && footerHeight.value > 0;

    if (areAllLayoutsCalculated) {
      if (!isCardCollapsed.value && translationY.value === 0) {
        return 0;
      }

      const extraOffset = extraSnapPointBottomOffset ?? 0;
      const footerTransYPosition =
        cardHeight.value - headerHeight.value - footerHeight.value - extraOffset;
      const userIsPanningFooter =
        translationY.value > 0 && translationY.value >= footerTransYPosition;

      if (userIsPanningFooter) {
        const panningValue = translationY.value - footerTransYPosition;
        return -panningValue;
      }

      return -footerTranslationY.value;
    } else {
      return 0;
    }
  }, [
    cardHeight,
    headerHeight,
    footerHeight,
    translationY,
    footerTranslationY,
    isKeyboardVisible,
    isCardCollapsed,
  ]);

  const animatedParentStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: '100%',
    zIndex: 3,
    bottom: derivedFooterTranslationY.value,
  }));

  const animatedChildStyle = useAnimatedStyle(() => ({
    opacity:
      hideFooterOnCardCollapse?.isEnabled && !isKeyboardVisible?.value
        ? interpolate(hideFooterInterpolation.value, [0, HIDE_CONTENT_OUTPUT_RANGE], [1, 0])
        : 1,
  }));

  const animatedStyleExtraMarginWrapper = useAnimatedStyle(() => ({
    display: isKeyboardVisible?.value && hasExtraMargin.value ? 'flex' : 'none',
    backgroundColor: 'transparent',
    height: EXTRA_MARGIN_WRAPPER_HEIGHT,
    width: '100%',
  }));

  const onLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (e.nativeEvent.layout.height > 0) {
        footerHeight.value = e.nativeEvent.layout.height;
      }
    },
    [footerHeight],
  );

  return (
    <Parentwrapper onLayout={onLayout} style={animatedParentStyle}>
      <ChildWrapper style={animatedChildStyle}>
        <ExtraMarginWrapper style={animatedStyleExtraMarginWrapper} />
        {footerComponent ?? (
          <ComponentWhenUndefined>
            <TextWhenUndefined>Footer component</TextWhenUndefined>
          </ComponentWhenUndefined>
        )}
      </ChildWrapper>
    </Parentwrapper>
  );
};

export default Footer;
