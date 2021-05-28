import Animated, { withTiming, scrollTo } from 'react-native-reanimated';
import { KEYBOARD_TIMING_EASING } from '../constants/animations';
import { CLOSE_OPEN_CARD_BUTTON_HITSLOP, KEYBOARD_CARD_HEIGHT_RATIO } from '../constants/styles';
import { SCROLL_EVENT_THROTTLE } from '../constants/configs';

/* NOTE: Eliminating race condition and flickering effect: When an input
is focused. Then one animation changes the card height where the
other animation translates the y position of the card so that the card
will float above the keyboard. This fix ensures that translation of the card
respects the change of height before it animates. 1 ms. wait time is enough. */
const AVOID_FLICKERING_MS = 0.1;

interface ResultCurrentAndPreviousProps {
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
  windowHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  contentHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  cardContentHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  footerHeight: Animated.SharedValue<number>;
}

export const onIsInputFieldFocusedReactionBottomSheet = ({
  result,
  previous,
  contentHeightWhenKeyboardIsVisible,
  cardContentHeight,
  headerHeight,
  footerHeight,
  windowHeight,
  scrollViewRef,
  translationY,
  footerTranslationY,
  isInputFieldFocused,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    const areAllLayoutsCalculated = headerHeight.value > 0 && footerHeight.value > 0;

    if (result.keyboardHeight.value > 0 && areAllLayoutsCalculated) {
      const res = result.selectedInputFieldPositionY.value;
      const availableContentSpace =
        windowHeight -
        headerHeight.value -
        footerHeight.value -
        result.keyboardHeight.value -
        CLOSE_OPEN_CARD_BUTTON_HITSLOP;

      const height = availableContentSpace * KEYBOARD_CARD_HEIGHT_RATIO;
      const isScrollable = cardContentHeight.value > height;
      const animationConfigIsScrollable = { duration: SCROLL_EVENT_THROTTLE };
      const animationConfigIsNotScrollable = {
        duration: result.keyboardDuration.value,
        KEYBOARD_TIMING_EASING,
      };
      const animationConfig = isScrollable
        ? animationConfigIsScrollable
        : animationConfigIsNotScrollable;

      contentHeightWhenKeyboardIsVisible.value = withTiming(
        isScrollable ? height : cardContentHeight.value,
        { duration: AVOID_FLICKERING_MS },
        () => {
          footerTranslationY.value = withTiming(-result.keyboardHeight.value, animationConfig);
          translationY.value = withTiming(-result.keyboardHeight.value, animationConfig, () => {
            scrollTo(scrollViewRef, 0, res, true);
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
