import Animated, { runOnJS } from 'react-native-reanimated';
import { IS_SCROLLABLE_OFFSET } from '../constants/animations';

interface Props {
  result: Record<string, Animated.SharedValue<number>>;
  previous: Record<string, Animated.SharedValue<number>> | undefined | null;
  contentHeight: Animated.SharedValue<number>;
  isSnapEffectActiveState: boolean;
  isCardOverlappingContent: boolean;
  windowHeight: number;
  offsetAddition: number;
  setIsSnapEffectActiveState: (status: boolean) => void;
}

export const onSnappableReaction = ({
  result,
  previous,
  windowHeight,
  contentHeight,
  isSnapEffectActiveState,
  isCardOverlappingContent,
  offsetAddition,
  setIsSnapEffectActiveState,
}: Props): void => {
  'worklet';
  if (result !== previous) {
    const isScrollable = contentHeight.value + offsetAddition > windowHeight;

    if (isCardOverlappingContent && !isScrollable) {
      runOnJS(setIsSnapEffectActiveState)(true);
    } else if (isSnapEffectActiveState) {
      runOnJS(setIsSnapEffectActiveState)(false);
    }
  }
};
