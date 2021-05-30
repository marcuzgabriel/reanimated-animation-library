import Animated, { scrollTo } from 'react-native-reanimated';
import { withTiming } from 'react-native-reanimated';
import { KEYBOARD_TIMING_EASING } from '../constants/animations';
import { SCROLL_EVENT_THROTTLE } from '../constants/configs';

interface ResultCurrentAndPreviousProps {
  contentHeight?: Animated.SharedValue<number>;
  contentHeightWhenKeyboardIsVisible?: Animated.SharedValue<number>;
  disableScrollAnimation?: boolean;
  keyboardAvoidBottomMargin?: number;
  scrollViewHeight?: Animated.SharedValue<number>;
  translationY?: Animated.SharedValue<number>;
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
  scrollViewHeight?: Animated.SharedValue<number>;
  contentHeight: Animated.SharedValue<number>;
  contentHeightWhenKeyboardIsVisible: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  keyboardAvoidBottomMargin?: number;
  disableScrollAnimation?: boolean;
  translationY: Animated.SharedValue<number>;
}

export const onIsInputFieldFocusedReaction = ({
  result,
  previous,
  windowHeight,
  contentHeight,
  disableScrollAnimation,
  keyboardAvoidBottomMargin,
  isInputFieldFocused,
  scrollViewRef,
  scrollViewHeight,
  translationY,
}: Props): void => {
  'worklet';

  if (result !== previous) {
    if (result.keyboardHeight.value > 0 && scrollViewHeight?.value) {
      const res = result.selectedInputFieldPositionY.value;
      const height = windowHeight - contentHeight.value;
      const isScrollable = contentHeight.value > height;
      const availableHeight = windowHeight - result.keyboardHeight.value;

      const animationConfigIsScrollable = { duration: SCROLL_EVENT_THROTTLE };
      const animationConfigIsNotScrollable = {
        duration: result.keyboardDuration.value,
        KEYBOARD_TIMING_EASING,
      };
      const animationConfig = isScrollable
        ? animationConfigIsScrollable
        : animationConfigIsNotScrollable;

      const defaultKeyboardAvoidBottomMargin = keyboardAvoidBottomMargin ?? 0;
      const scrollToNumber = res - scrollViewHeight.value + defaultKeyboardAvoidBottomMargin;

      translationY.value = withTiming(-result.keyboardHeight.value, animationConfig, () => {});
      scrollTo(scrollViewRef, 0, scrollToNumber, disableScrollAnimation ? false : true);

      isInputFieldFocused.value = true;
    } else {
      translationY.value = 0;
      isInputFieldFocused.value = false;
    }
  }
};
