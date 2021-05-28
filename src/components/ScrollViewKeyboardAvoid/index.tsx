import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';
import ReusablePropsProvider from '../../containers/ReusablePropsProvider';
import type { MixedScrollViewProps } from '../../types';

type Ref = Animated.ScrollView;

/* TODO: Cleanup proporsal. Not critical. Currently all props parsed into this component
is parsed forward to Animated.ScrollView component. It does not affect performance or type
assesment, but the component does have alot of unecessary props. */
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
