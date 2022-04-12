import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { onScrollGetScrollingMeasures } from '../onScrollGetScrollingMeasures';

const PARAMS = {
  scrollY: { value: 0 } as Animated.SharedValue<number>,
  scrollViewHeight: { value: 0 } as Animated.SharedValue<number>,
  scrollingLength: { value: 0 } as Animated.SharedValue<number>,
  contentHeight: { value: 0 } as Animated.SharedValue<number>,
  isScrolledToTop: { value: false } as Animated.SharedValue<boolean>,
  isScrolledToEnd: { value: false } as Animated.SharedValue<boolean>,
  isScrollable: { value: false } as Animated.SharedValue<boolean>,
};

describe('src/worklets/onScrollGetScrollingMeasures', () => {
  it('should update scrollingLength.value to match contentHeight.value minus scrollViewHeight.value', () => {
    renderHook(() => {
      PARAMS.contentHeight = useSharedValue(100);
      PARAMS.scrollViewHeight = useSharedValue(50);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.scrollingLength.value).toBe(
      PARAMS.contentHeight.value - PARAMS.scrollViewHeight.value,
    );
    expect(PARAMS.scrollingLength.value).toBe(50);
  });

  it('should update isScrollable.value to true when contentHeight.value is higher than scrollViewHeight.value', () => {
    renderHook(() => {
      PARAMS.isScrollable = useSharedValue(false);
      PARAMS.contentHeight = useSharedValue(100);
      PARAMS.scrollViewHeight = useSharedValue(50);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrollable.value).toBeTruthy();
  });

  it('should update isScrollable.value to false when contentHeight.value is less than scrollViewHeight.value', () => {
    renderHook(() => {
      PARAMS.isScrollable = useSharedValue(true);
      PARAMS.contentHeight = useSharedValue(49);
      PARAMS.scrollViewHeight = useSharedValue(50);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrollable.value).toBeFalsy();
  });

  it('should update isScrolledToTop.value to true when scrollY.value is 0', () => {
    renderHook(() => {
      PARAMS.scrollY = useSharedValue(0);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrolledToTop.value).toBeTruthy();
  });

  it('should update isScrollToTopValue to false when scrollY.value is higher than 0', () => {
    renderHook(() => {
      PARAMS.scrollY = useSharedValue(1);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrolledToTop.value).toBeFalsy();
  });

  it('should update isScrolledToEnd to true, when scrollY.value is equal to scrollingLength.value', () => {
    renderHook(() => {
      PARAMS.scrollY = useSharedValue(100);
      PARAMS.contentHeight = useSharedValue(200);
      PARAMS.scrollViewHeight = useSharedValue(100);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrolledToEnd.value).toBeTruthy();
  });

  it(`should update isScrolledToEnd to true, when scrollY.value is equal to scrollingLength.value,
  by rounding down to nearest number`, () => {
    renderHook(() => {
      PARAMS.contentHeight = useSharedValue(200.6);
      PARAMS.scrollViewHeight = useSharedValue(100);
      PARAMS.scrollY = useSharedValue(100.4);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrolledToEnd.value).toBeTruthy();
  });

  it('should update isScrolledToEnd to false, when scrollY.value is not equal to scrollingLength.value', () => {
    renderHook(() => {
      PARAMS.scrollY = useSharedValue(50);
      PARAMS.scrollingLength = useSharedValue(100);
    });

    onScrollGetScrollingMeasures(PARAMS);

    expect(PARAMS.isScrolledToEnd.value).toBeFalsy();
  });
});
