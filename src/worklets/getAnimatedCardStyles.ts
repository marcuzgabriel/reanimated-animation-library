import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

/* It is not possible to put styles as a constant when
running it on the UI thread */
export const getAnimatedCardStyles = (
  animatedValue: number,
): Animated.AnimatedStyleProp<Record<string, unknown>> => {
  'worklet';

  return Platform.OS === 'ios'
    ? {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        bottom: 0,
        backgroundColor: 'lightgrey',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        transform: [{ translateY: animatedValue }],
      }
    : {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        bottom: 0,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        backgroundColor: 'lightgrey',
        elevation: 10,
        transform: [{ translateY: animatedValue }],
      };
};
