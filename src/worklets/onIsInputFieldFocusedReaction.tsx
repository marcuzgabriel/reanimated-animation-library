import Animated, { scrollTo } from 'react-native-reanimated';
import { KEYBOARD_TIMING_EASING } from '../constants/animations';
import { SCROLL_EVENT_THROTTLE } from '../constants/configs';

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
  windowHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView> | any;
  contentHeight: Animated.SharedValue<number>;
}

/* NOTE: Eliminating race condition and flickering effect: When an input
is focused. Then one animation changes the card height where the
other animation translates the y position of the card so that the card
will float above the keyboard. This fix ensures that translation of the card
respects the change of height before it animates. 1 ms. wait time is enough. */
const AVOID_FLICKERING_MS = 0.1;

export const onIsInputFieldFocusedReaction = ({
  result,
  previous,
  windowHeight,
  contentHeight,
  scrollViewRef,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    if (result.keyboardHeight.value) {
      const res = result.selectedInputFieldPositionY.value;
      const height = windowHeight - contentHeight.value;
      const isScrollable = contentHeight.value > height;

      const animationConfigIsScrollable = { duration: SCROLL_EVENT_THROTTLE };
      const animationConfigIsNotScrollable = {
        duration: result.keyboardDuration.value,
        KEYBOARD_TIMING_EASING,
      };
      const animationConfig = isScrollable
        ? animationConfigIsScrollable
        : animationConfigIsNotScrollable;

      scrollTo(scrollViewRef, 0, 500, true);
    }
  }
};
