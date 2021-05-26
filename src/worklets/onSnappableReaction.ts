import Animated, { runOnJS } from 'react-native-reanimated';
import { IS_SCROLLABLE_OFFSET } from '../constants/animations';

interface Props {
  result: boolean | undefined;
  previous: boolean | undefined | null;
  contentHeight: Animated.SharedValue<number>;
  isSnapEffectActiveState: boolean;
  windowHeight: number;
  setIsSnapEffectActiveState: (status: boolean) => void;
}

export const onSnappableReaction = ({
  result,
  previous,
  windowHeight,
  contentHeight,
  isSnapEffectActiveState,
  setIsSnapEffectActiveState,
}: Props): void => {
  'worklet';
  if (result !== previous) {
    /* Be aware: window height is a very easy way
    of determing scrollability as in many cases there
    are a header that needs to be a part of the calculation
    as well */

    const isScrollable = contentHeight.value > windowHeight + IS_SCROLLABLE_OFFSET;
    const isSnapEffectActive = result && !isScrollable;

    if (isSnapEffectActive && !isSnapEffectActiveState) {
      console.log('[ANIMATION REACTION #1]');
      runOnJS(setIsSnapEffectActiveState)(true);
    } else if (isSnapEffectActiveState) {
      console.log('[ANIMATION REACTION #1]');
      runOnJS(setIsSnapEffectActiveState)(false);
    }
  }
};
