import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';
import type { MixedScrollViewProps } from '../../types';
import ReusablePropsProvider from '../../containers/ReusablePropsProvider';

type Ref = Animated.ScrollView;

const ScrollViewKeyboardAvoid = React.forwardRef<Ref, MixedScrollViewProps>((props, ref) => {
  const { contextName, children } = props;

  return contextName === 'bottomSheet' ? (
    <Animated.ScrollView ref={ref} {...props}>
      {children}
    </Animated.ScrollView>
  ) : (
    <KeyboardProvider>
      <ReusablePropsProvider contextName="scrollViewKeyboardAvoid">
        <ScrollView scrollViewRef={ref} {...props}>
          {children}
        </ScrollView>
      </ReusablePropsProvider>
    </KeyboardProvider>
  );
});

export default ScrollViewKeyboardAvoid;
