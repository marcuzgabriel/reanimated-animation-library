import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';
import type { MixedScrollViewProps } from '../../types';
import ReusablePropsProvider from '../../containers/ReusablePropsProvider';

type Ref = Animated.ScrollView;

const ScrollViewKeyboardAvoid = React.forwardRef<Ref, MixedScrollViewProps>((props, ref) => {
  const { type, children } = props;

  return type === 'bottomSheet' ? (
    <Animated.ScrollView ref={ref} {...props}>
      {children}
    </Animated.ScrollView>
  ) : (
    <KeyboardProvider>
      <ReusablePropsProvider type="scrollViewKeyboardAvoid">
        <ScrollView scrollViewRef={ref} {...props}>
          {children}
        </ScrollView>
      </ReusablePropsProvider>
    </KeyboardProvider>
  );
});

export default ScrollViewKeyboardAvoid;
