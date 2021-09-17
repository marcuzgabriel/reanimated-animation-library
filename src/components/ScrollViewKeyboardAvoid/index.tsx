import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';
import type { ScrollViewProps } from '../../types';

type Ref = Animated.ScrollView;

const ScrollViewKeyboardAvoid = React.forwardRef<Ref, ScrollViewProps>((props, ref) => (
  <KeyboardProvider>
    <ScrollView scrollViewRef={ref} {...props}>
      {props.children}
    </ScrollView>
  </KeyboardProvider>
));

export default ScrollViewKeyboardAvoid;
