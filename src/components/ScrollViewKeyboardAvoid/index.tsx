import React from 'react';
import Animated from 'react-native-reanimated';
import { ScrollViewProps } from 'react-native';
import { GestureEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import ScrollView from './ScrollView';
import KeyboardProvider from '../../containers/KeyboardProvider';

interface MixedProps extends ScrollViewProps {
  panGestureType?: Animated.SharedValue<number>;
  isScrollingCard?: Animated.SharedValue<boolean>;
  isInputFieldFocused?: Animated.SharedValue<boolean>;
  cardHeightWhenKeyboardIsVisible?: Animated.SharedValue<number>;
  type?: string;
  children: React.ReactNode;
  gestureHandler?: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
}

type Ref = Animated.ScrollView;

/* Note: Enables resuability of the ScrollViewKeyboardAvoid component for single
use cases where it is already configured in etc. BottomSheet */
const ScrollViewKeyboardAvoid = React.forwardRef<Ref, MixedProps>((props, ref) => {
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
