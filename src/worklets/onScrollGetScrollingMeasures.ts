import Animated from 'react-native-reanimated';

interface Props {
  scrollY: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  scrollingLength: Animated.SharedValue<number>;
  contentHeight: Animated.SharedValue<number>;
  isScrolledToTop: Animated.SharedValue<boolean>;
  isScrolledToEnd: Animated.SharedValue<boolean>;
  isScrollable: Animated.SharedValue<boolean>;
}

export const onScrollGetScrollingMeasures = ({
  scrollY,
  scrollViewHeight,
  scrollingLength,
  isScrolledToTop,
  isScrolledToEnd,
  isScrollable,
  contentHeight,
}: Props): void => {
  'worklet';

  scrollingLength.value = contentHeight.value - scrollViewHeight.value;
  isScrollable.value = contentHeight.value > scrollViewHeight.value;
  isScrolledToTop.value = scrollY.value === 0;
  isScrolledToEnd.value = Math.floor(scrollY.value) === Math.floor(scrollingLength.value);
};
