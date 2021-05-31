import Animated, { runOnJS } from 'react-native-reanimated';
import { IS_SCROLLABLE_OFFSET } from '../constants/animations';

interface Props {
  result: Record<string, Animated.SharedValue<number>>;
  previous: Record<string, Animated.SharedValue<number>> | undefined | null;
  contentHeight: Animated.SharedValue<number>;
  isSnapEffectActiveState: boolean;
  isCardOverlappingContent: boolean;
  windowHeight: number;
  setIsSnapEffectActiveState: (status: boolean) => void;
}

export const onSnappableReaction = ({
  result,
  previous,
  windowHeight,
  contentHeight,
  isSnapEffectActiveState,
  isCardOverlappingContent,
  setIsSnapEffectActiveState,
}: Props): void => {
  'worklet';
  if (result !== previous) {
    const isScrollable = contentHeight.value > windowHeight + IS_SCROLLABLE_OFFSET;

    if (isCardOverlappingContent && !isScrollable) {
      runOnJS(setIsSnapEffectActiveState)(true);
    } else if (isSnapEffectActiveState) {
      runOnJS(setIsSnapEffectActiveState)(false);
    }
  }
};
