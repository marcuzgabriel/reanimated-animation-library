import React from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';
import KeyboardAvoidingViewProvider from '../../../containers/KeyboardAvoidingViewProvider';

type Ref = Animated.ScrollView;
type Props = any;

const ScrollView = React.forwardRef<Ref, Props>((props, ref) => {
  const { type } = props;
  const isInputFieldFocused = useSharedValue(false);

  return type === 'bottomSheet' ? (
    <Animated.ScrollView ref={ref} {...props}>
      {props.children}
    </Animated.ScrollView>
  ) : (
    <Animated.ScrollView ref={ref} {...props}>
      <KeyboardAvoidingViewProvider
        isInputFieldFocused={isInputFieldFocused}
        cardHeightWhenKeyboardIsVisible={props.cardHeightWhenKeyboardIsVisible}
      >
        {props.children}
      </KeyboardAvoidingViewProvider>
    </Animated.ScrollView>
  );
});

export default ScrollView;
