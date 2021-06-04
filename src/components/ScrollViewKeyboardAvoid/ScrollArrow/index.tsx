import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollArrowDefault from './ScrollArrowDefault';
import type { ScrollProps } from '../../../types';
interface Props extends ScrollProps {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  scrollArrowTopComponent?: React.ReactNode;
  scrollArrowBottomComponent?: React.ReactNode;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  position: string;
  contextName: string;
  component?: React.ReactNode;
}

interface ContextProps extends Partial<Props> {
  isInputFieldFocused: Animated.SharedValue<boolean>;
  position: string;
  contextName: string;
}

const ScrollArrow: React.FC<Props | ContextProps> = props => {
  const { component } = props;

  if (component) {
    return <ScrollArrowDefault {...props} component={component} />;
  }

  return <ScrollArrowDefault {...props} />;
};

export default ScrollArrow;
