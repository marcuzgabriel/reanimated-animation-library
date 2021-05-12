import Animated, { Easing, withTiming, scrollTo } from 'react-native-reanimated';
import { KEYBOARD_TIMING_EASING, DEFAULT_TIMING_CONFIG } from 'constants/animations';
import { KEYBOARD_CARD_HEIGHT_RATIO } from 'constants/styles';
import { SCROLL_EVENT_THROTTLE } from 'constants/configs';

/* NOTE: Eliminating race condition and flickering effect: When an input
is focused. Then one animation changes the card height where the
other animation translates the y position of the card so that the card
will float above the keyboard. This fix ensures that translation of the card
respects the change of height before it animates. 1 ms. wait time is enough. */
const AVOID_FLICKERING_MS = 1;

interface Props {
  result: Record<string, Animated.SharedValue<number>>;
  previous: Record<string, Animated.SharedValue<number>> | null | undefined;
  translationY: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  windowHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  cardHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  cardContentHeight: Animated.SharedValue<number>;
}

export const onIsInputFieldFocusedReaction = ({
  result,
  previous,
  cardHeightWhenKeyboardIsVisible,
  cardContentHeight,
  windowHeight,
  scrollViewRef,
  translationY,
  isInputFieldFocused,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    const res = result.selectedInputFieldPositionY.value - 32;
    const height = windowHeight * KEYBOARD_CARD_HEIGHT_RATIO;
    const isScrollable = cardContentHeight.value > height;
    const animationConfigIsScrollable = { duration: SCROLL_EVENT_THROTTLE };
    const animationConfigIsNotScrollable = {
      duration: result.keyboardDuration.value,
      KEYBOARD_TIMING_EASING,
    };
    const animationConfig = isScrollable
      ? animationConfigIsScrollable
      : animationConfigIsNotScrollable;

    if (result.keyboardHeight.value > 0) {
      if (translationY.value !== -result.keyboardHeight.value && isInputFieldFocused.value) {
        translationY.value = -result.keyboardHeight.value;
      }

      if (translationY.value !== -result.keyboardHeight.value) {
        cardHeightWhenKeyboardIsVisible.value = withTiming(
          height,
          { duration: AVOID_FLICKERING_MS },
          () => {
            translationY.value = withTiming(-result.keyboardHeight.value, animationConfig, () => {
              scrollTo(scrollViewRef, 0, res, true);
            });
          },
        );
      } else {
        scrollTo(scrollViewRef, 0, res, true);
      }

      isInputFieldFocused.value = true;
    }

    if (result.keyboardHeight.value === 0 && isInputFieldFocused.value) {
      cardHeightWhenKeyboardIsVisible.value = 0;
      translationY.value = 0;
      scrollTo(scrollViewRef, 0, 0, false);
      isInputFieldFocused.value = false;
    }
  }
};
