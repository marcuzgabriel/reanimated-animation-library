import Animated, { runOnJS } from 'react-native-reanimated';
import { IS_SCROLLABLE_OFFSET } from 'constants/animations';

interface Props {
  result: Record<string, Animated.SharedValue<number | boolean>> | undefined;
  previous: Record<string, Animated.SharedValue<number | boolean>> | undefined | null;
  isScrollable: Animated.SharedValue<boolean>;
  isSnapEffectActive: Animated.SharedValue<boolean>;
  isCardOverlappingContent: Animated.SharedValue<boolean>;
  isSnapEffectActiveState: boolean;
  windowHeight: number;
  setIsSnapEffectActiveState: (status: boolean) => void;
}

export const isSnappableReaction = ({
  result,
  previous,
  windowHeight,
  isCardOverlappingContent,
  isSnapEffectActive,
  isSnapEffectActiveState,
  isScrollable,
  setIsSnapEffectActiveState,
}: Props): void => {
  'worklet';
  if (result !== previous) {
    /* Be aware: window height is a very easy way
    of determing scrollability as in many cases there
    are a header that needs to be a part of the calculation
    as well */

    const { contentHeight, cardHeight } = result ?? {};

    isScrollable.value = contentHeight.value > windowHeight + IS_SCROLLABLE_OFFSET;
    isCardOverlappingContent.value = contentHeight.value > cardHeight.value;
    isSnapEffectActive.value = isCardOverlappingContent.value && !isScrollable.value;

    if (isSnapEffectActive.value && !isSnapEffectActiveState) {
      console.log('[ANIMATION REACTION #1]');
      runOnJS(setIsSnapEffectActiveState)(true);
    } else if (isSnapEffectActiveState) {
      console.log('[ANIMATION REACTION #1]');
      runOnJS(setIsSnapEffectActiveState)(false);
    }
  }
};
