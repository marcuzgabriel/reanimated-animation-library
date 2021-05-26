import Animated from 'react-native-reanimated';
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP } from '../constants/styles';

interface Props {
  result: number;
  previous: number | null | undefined;
  isKeyboardVisible: Animated.SharedValue<boolean>;
  translationY: Animated.SharedValue<number>;
  footerTranslationY: Animated.SharedValue<number>;
  cardHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
}

export const onPanGestureHitFooterReaction = ({
  result,
  previous,
  isKeyboardVisible,
  translationY,
  footerTranslationY,
  cardHeight,
  headerHeight,
  footerHeight,
}: Props): void => {
  'worklet';

  const areAllLayoutsCalculated =
    cardHeight.value > 0 && headerHeight.value > 0 && footerHeight.value > 0;

  if (result !== previous && areAllLayoutsCalculated) {
    const footerTransYPosition =
      cardHeight.value - headerHeight.value - footerHeight.value - CLOSE_OPEN_CARD_BUTTON_HITSLOP;
    const isHittingFooter = translationY.value >= footerTransYPosition;

    if (isHittingFooter) {
      footerTranslationY.value = translationY.value - footerTransYPosition;
    } else if (!isKeyboardVisible.value) {
      footerTranslationY.value = 0;
    }
  }
};
