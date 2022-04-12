import Animated, { runOnJS } from 'react-native-reanimated';

interface Props {
  contentHeight: Animated.SharedValue<number>;
  isSnapEffectActiveState: boolean;
  isCardOverlappingContent: boolean;
  windowHeight: number;
  offsetAddition: number;
  setIsSnapEffectActiveState: (status: boolean) => void;
}

export const onSnappableReaction = ({
  windowHeight,
  contentHeight,
  isSnapEffectActiveState,
  isCardOverlappingContent,
  offsetAddition,
  setIsSnapEffectActiveState,
}: Props): void => {
  'worklet';

  const isScrollable = contentHeight.value + offsetAddition > windowHeight;

  if (isCardOverlappingContent && !isScrollable) {
    runOnJS(setIsSnapEffectActiveState)(true);
  } else if (isScrollable || isSnapEffectActiveState) {
    runOnJS(setIsSnapEffectActiveState)(false);
  }
};
