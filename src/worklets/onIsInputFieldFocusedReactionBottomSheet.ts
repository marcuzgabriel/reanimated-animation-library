import Animated, { withTiming, scrollTo } from 'react-native-reanimated';
import { KEYBOARD_TIMING_EASING } from '../constants/animations';
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP, MAX_HEIGHT_RATIO } from '../constants/styles';
import { SCROLL_EVENT_THROTTLE } from '../constants/configs';

/* NOTE: Eliminating race condition and flickering effect: When an input
is focused. Then one animation changes the card height where the
other animation translates the y position of the card so that the card
will float above the keyboard. This fix ensures that translation of the card
respects the change of height before it animates. 1 ms. wait time is enough. */
const AVOID_FLICKERING_MS = 0.1;

interface ResultCurrentAndPreviousProps {
  keyboardAvoidBottomMargin?: number;
  contentHeight?: Animated.SharedValue<number> | undefined;
  isKeyboardVisible: Animated.SharedValue<boolean>;
  keyboardHeight: Animated.SharedValue<number>;
  keyboardDuration: Animated.SharedValue<number>;
  selectedInputFieldPositionY: Animated.SharedValue<number>;
}
interface Props {
  result: ResultCurrentAndPreviousProps;
  previous: ResultCurrentAndPreviousProps | null | undefined;
  translationY: Animated.SharedValue<number>;
  footerTranslationY: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  keyboardAvoidBottomMargin?: number;
  windowHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  scrollViewHeight: Animated.SharedValue<number>;
  contentHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  contentHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
}

export const onIsInputFieldFocusedReactionBottomSheet = ({
  result,
  previous,
  contentHeightWhenKeyboardIsVisible,
  contentHeight,
  headerHeight,
  keyboardAvoidBottomMargin,
  footerHeight,
  windowHeight,
  scrollViewRef,
  scrollViewHeight,
  translationY,
  footerTranslationY,
  isInputFieldFocused,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    if (result.keyboardHeight.value > 0) {
      const res = result.selectedInputFieldPositionY.value;
      const availableContentSpace =
        windowHeight -
        headerHeight.value -
        footerHeight.value -
        result.keyboardHeight.value -
        CLOSE_OPEN_CARD_BUTTON_HITSLOP;

      const height = availableContentSpace * MAX_HEIGHT_RATIO;
      const isScrollable = contentHeight.value > height;
      const animationConfigIsScrollable = { duration: SCROLL_EVENT_THROTTLE };
      const animationConfigIsNotScrollable = {
        duration: result.keyboardDuration.value,
        KEYBOARD_TIMING_EASING,
      };
      const animationConfig = isScrollable
        ? animationConfigIsScrollable
        : animationConfigIsNotScrollable;

      const defaultKeyboardAvoidBottomMargin = keyboardAvoidBottomMargin ?? 0;
      const scrollToNumber = res - height / 2 + defaultKeyboardAvoidBottomMargin;

      contentHeightWhenKeyboardIsVisible.value = withTiming(
        isScrollable ? height : contentHeight.value,
        { duration: AVOID_FLICKERING_MS },
        () => {
          footerTranslationY.value = withTiming(-result.keyboardHeight.value, animationConfig);
          translationY.value = withTiming(-result.keyboardHeight.value, animationConfig, () => {
            scrollTo(scrollViewRef, 0, scrollToNumber, true);
          });
        },
      );

      isInputFieldFocused.value = true;
    }

    if (result.keyboardHeight.value === 0 && isInputFieldFocused.value) {
      contentHeightWhenKeyboardIsVisible.value = 0;
      translationY.value = 0;
      footerTranslationY.value = 0;
      scrollTo(scrollViewRef, 0, 0, false);
      isInputFieldFocused.value = false;
    }
  }
};
