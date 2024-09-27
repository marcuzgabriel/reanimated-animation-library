import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { getAnimatedMeasures } from '../../helpers';

interface InputAnimationWrapperProps {
  scrollY: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  contentHeight: Animated.SharedValue<number>;
  keyboardHeight: Animated.SharedValue<number>;
  isKeyboardVisible: Animated.SharedValue<boolean>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
}

const InputAnimationWrapper: React.FC<InputAnimationWrapperProps> = ({
  scrollY,
  scrollViewHeight,
  contentHeight,
  keyboardHeight,
  isKeyboardVisible,
  isInputFieldFocused,
  isScrollable,
  children,
}) => {
  const animatedRef = useAnimatedRef<Animated.View>();
  const positionY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 999,
    height: windowHeight,
    backgroundColor: 'transparent',
    bottom: translationY.value,
  }));

  const { height: windowHeight } = useWindowDimensions();

  /* TODO:
  - Ensure that translation Y is right above keyboard.
    The value is probably coming from the outside
  - Add flexibility to input position

  */

  useEffect(() => {
    if (animatedRef?.current) {
      getAnimatedMeasures({
        ref: animatedRef,
        callback: ({ y }) => {
          if (positionY.value !== y) {
            positionY.value = y;
          }
        },
      });
    }
  });
  useAnimatedReaction(
    () => isInputFieldFocused,
    (curr, prev) => {
      if (curr.value) {
        const keyboardYPosition = windowHeight - keyboardHeight.value;
        const diff = positionY.value - keyboardYPosition;

        // console.log('InputfField is focused', {
        //   keyboardHeight: keyboardHeight.value,
        //   contentHeight: contentHeight.value,
        //   positionY: positionY.value,
        //   keyboardYPosition,
        //   windowHeight,
        //   diff,
        // });

        translationY.value = withTiming(-50, { duration: 250 }, isAnimationDone => {
          if (isAnimationDone) {
            console.log('animation is done');
          }
        });
      }
    },
    [isInputFieldFocused],
  );

  return (
    <Animated.View ref={animatedRef} style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

export default InputAnimationWrapper;
