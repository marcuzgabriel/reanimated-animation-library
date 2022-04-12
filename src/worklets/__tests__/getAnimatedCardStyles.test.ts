import 'react-native-reanimated';
import { Platform } from 'react-native';
import { getAnimatedCardStyles } from '../getAnimatedCardStyles';

describe('getAnimatedCardStyle', () => {
  it('should print specific style object when platform is Android', () => {
    Platform.OS = 'android';

    const result = getAnimatedCardStyles({
      translationY: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: 'black',
    });

    expect(result).toMatchObject({
      position: 'absolute',
      zIndex: 2,
      width: '100%',
      bottom: 0,
      borderTopRightRadius: 16,
      borderTopLeftRadius: 16,
      elevation: 10,
      transform: [{ translateY: 0 }],
      backgroundColor: 'black',
    });
  });

  it('should print specific style object when platform is iOS', () => {
    Platform.OS = 'ios';

    const result = getAnimatedCardStyles({
      translationY: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: 'black',
    });

    expect(result).toMatchObject({
      position: 'absolute',
      zIndex: 2,
      width: '100%',
      borderTopRightRadius: 16,
      borderTopLeftRadius: 16,
      bottom: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      transform: [{ translateY: 0 }],
      backgroundColor: 'black',
    });
  });
});
