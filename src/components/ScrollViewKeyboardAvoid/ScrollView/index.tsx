import React from 'react';
import Animated from 'react-native-reanimated';
import ScrollViewStandAlone from './ScrollViewStandAlone';
import type { MixedScrollViewProps } from '../../../types';

type Ref = Animated.ScrollView;
type Props = MixedScrollViewProps;

const ScrollView = React.forwardRef<Ref, Props>((props, ref) =>
  props.type === 'bottomSheet' ? (
    <Animated.ScrollView ref={ref} {...props}>
      {props.children}
    </Animated.ScrollView>
  ) : (
    <ScrollViewStandAlone scrollViewRef={ref} {...props} />
  ),
);

export default ScrollView;
