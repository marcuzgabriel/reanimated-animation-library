import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollArrowDefault from './ScrollArrowDefault';
import type { ScrollProps } from '../../../types';

interface Props extends ScrollProps {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  scrollArrowTopComponent?: React.ReactNode;
  scrollArrowBottomComponent?: React.ReactNode;
  position: string;
}

const ScrollArrow: React.FC<Props> = props => {
  const { scrollArrowTopComponent, scrollArrowBottomComponent, position } = props;

  if (!!scrollArrowTopComponent || scrollArrowBottomComponent) {
    return (
      <ScrollArrowDefault
        {...props}
        component={position === 'top' ? scrollArrowTopComponent : scrollArrowBottomComponent}
      />
    );
  }

  return <ScrollArrowDefault {...props} />;
};

export default ScrollArrow;
