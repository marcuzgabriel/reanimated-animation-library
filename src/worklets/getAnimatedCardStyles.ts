import { Platform } from 'react-native';
import { AnimatedStyleProp } from 'react-native-reanimated';

/* Borders will always be defined either by user config or
default based on the provider. The interface concerning
border is for type satisfaction */
interface Props {
  translationY: number;
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  backgroundColor: string;
}

export const getAnimatedCardStyles = ({
  translationY,
  borderTopLeftRadius,
  borderTopRightRadius,
  backgroundColor,
}: Props): AnimatedStyleProp<Record<string, unknown>> => {
  'worklet';

  return Platform.OS === 'ios'
    ? {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        borderTopRightRadius,
        borderTopLeftRadius,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        transform: [{ translateY: translationY }],
        backgroundColor,
      }
    : {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        bottom: 0,
        borderTopRightRadius,
        borderTopLeftRadius,
        elevation: 10,
        transform: [{ translateY: translationY }],
        backgroundColor,
      };
};
