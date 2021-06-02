import Animated, { withTiming } from 'react-native-reanimated';

interface Props {
  result: number;
  snapPointBottom: Animated.SharedValue<number>;
  hideContentInterpolation: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
}

export const onContentHideReaction = ({
  result,
  snapPointBottom,
  footerHeight,
  hideContentInterpolation,
}: Props): void => {
  'worklet';

  if (snapPointBottom.value > 0) {
    const isGestureCloseToBottom = result >= snapPointBottom.value - footerHeight.value;
    hideContentInterpolation.value = withTiming(isGestureCloseToBottom ? 5 : 0);
  }
};
