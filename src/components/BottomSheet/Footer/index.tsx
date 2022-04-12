import React, { useCallback, useContext } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, useDerivedValue } from 'react-native-reanimated';
import { HIDE_CONTENT_OUTPUT_RANGE } from '../../../constants/animations';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import SmoothAppearance from '../SmoothAppearance';

interface Props {
  isCardCollapsed: Animated.SharedValue<boolean>;
}

const Parentwrapper = Animated.View;
const ChildWrapper = Animated.View;

const Footer: React.FC<Props> = ({ isCardCollapsed }) => {
  const { footerComponent, extraSnapPointBottomOffset, hideFooterOnCardCollapse, header } =
    useContext(UserConfigurationContext);

  const {
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
      <SmoothAppearance>
        <ChildWrapper style={animatedChildStyle}>{footerComponent}</ChildWrapper>
      </SmoothAppearance>
    </Parentwrapper>
  );
};

export default Footer;
