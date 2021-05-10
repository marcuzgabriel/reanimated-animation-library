import Animated, { scrollTo, withTiming } from 'react-native-reanimated';
import { KEYBOARD_CARD_HEIGHT_RATIO, MAX_HEIGHT_RATIO } from 'constants/styles';
import { DEFAULT_TIMING_CONFIG } from 'constants/animations';

interface Props {
  result: Record<string, Animated.SharedValue<number>>;
  previous: Record<string, Animated.SharedValue<number>> | null | undefined;
  maxHeight: Animated.SharedValue<number>;
  translationY: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  windowHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
}

export const onIsInputFieldFocusedReaction = ({
  result,
  previous,
  maxHeight,
  windowHeight,
  scrollViewRef,
  translationY,
  isInputFieldFocused,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    if (result.keyboardHeight.value > 0) {
      const res = result.selectedInputFieldPositionY.value - 32;

      /* TODO: Play around with height */
      maxHeight.value = withTiming(300, DEFAULT_TIMING_CONFIG);
      translationY.value = withTiming(-result.keyboardHeight.value, DEFAULT_TIMING_CONFIG);

      scrollTo(scrollViewRef, 0, res, true);
      isInputFieldFocused.value = true;
    }

    if (result.keyboardHeight.value === 0 && isInputFieldFocused.value) {
      translationY.value = withTiming(0, DEFAULT_TIMING_CONFIG);
      maxHeight.value = withTiming(windowHeight * MAX_HEIGHT_RATIO, DEFAULT_TIMING_CONFIG);
      isInputFieldFocused.value = false;
    }
  }
};
