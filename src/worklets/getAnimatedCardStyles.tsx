import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { CARD_STYLES_IOS, CARD_STYLES_ANDROID } from '../constants/styles';

export const getAnimatedCardStyles = (
  animatedValue: number,
): Animated.AnimatedStyleProp<Record<string, unknown>> => {
  'worklet';

  return Platform.OS === 'ios'
    ? {
        ...CARD_STYLES_IOS,
        transform: [{ translateY: animatedValue }],
      }
    : {
        ...CARD_STYLES_ANDROID,
        transform: [{ translateY: animatedValue }],
      };
};
