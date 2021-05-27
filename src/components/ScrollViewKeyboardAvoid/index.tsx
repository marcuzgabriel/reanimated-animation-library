import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';
import type { MixedScrollViewProps } from '../../types';

type Ref = Animated.ScrollView;

/* Note: Enables resuability of the ScrollViewKeyboardAvoid component for single
use cases */
const ScrollViewKeyboardAvoid = React.forwardRef<Ref, MixedScrollViewProps>((props, ref) => {
  const { type, children } = props;

  return type === 'bottomSheet' ? (
    <ScrollView ref={ref} {...props}>
      {children}
    </ScrollView>
  ) : (
    <KeyboardProvider>
      <ScrollView ref={ref} {...props}>
        {children}
      </ScrollView>
    </KeyboardProvider>
  );
});

export default ScrollViewKeyboardAvoid;
