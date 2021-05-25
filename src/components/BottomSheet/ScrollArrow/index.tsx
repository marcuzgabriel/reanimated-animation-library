import React, { useMemo, useContext } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import SvgArrow from './SvgArrow';
import { ReusablePropsContext } from 'containers/ReusablePropsProvider';
import { onScrollArrowAppearanceReaction } from 'worklets';
import { scrollTo as scrollToHelper } from 'helpers';
import { ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from 'constants/animations';
import { UserConfigurationContext } from 'containers/UserConfigurationProvider';
import ScrollArrowDefault from './ScrollArrowDefault';
interface Props {
  position: string;
}

const ScrollArrow: React.FC<Props> = ({ position }) => {
  const { scrollArrow } = useContext(UserConfigurationContext);

  switch (true) {
    case !scrollArrow:
      return null;
    case !!scrollArrow.componentBottomArrow || !!scrollArrow.componentTopArrow:
      return (
        <ScrollArrowDefault
          position={position}
          component={
            position === 'top' ? scrollArrow.componentTopArrow : scrollArrow.componentBottomArrow
          }
        />
      );
    default:
      return <ScrollArrowDefault position={position} />;
  }
};

export default ScrollArrow;
