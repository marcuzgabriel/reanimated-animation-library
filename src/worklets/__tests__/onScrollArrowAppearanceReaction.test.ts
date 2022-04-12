import Animated, { withTiming, useSharedValue } from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-hooks';
import { onScrollArrowAppearanceReaction } from '../onScrollArrowAppearanceReaction';
import { ARROW_UP_OFFSET, ARROW_DOWN_OFFSET } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_TIMING = 500;
const PARAMS = {
  isScrolledToTop: { value: false } as Animated.SharedValue<boolean>,
  isScrolledToEnd: { value: false } as Animated.SharedValue<boolean>,
  isScrollable: { value: false } as Animated.SharedValue<boolean>,
  isInputFieldFocused: { value: false } as Animated.SharedValue<boolean>,
  isScrolling: { value: false } as Animated.SharedValue<boolean>,
  opacityInterpolationEndArrow: { value: 0 } as Animated.SharedValue<number>,
  opacityInterpolationTopArrow: { value: 0 } as Animated.SharedValue<number>,
};

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  withTiming: jest.fn(),
}));

describe('src/worklets/onScrollArrowAppearanceReaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('user is scrolling and has not selected an input field', () => {
    beforeEach(() => {
      PARAMS.isScrollable.value = true;
      PARAMS.isInputFieldFocused.value = false;

      /* NOTE: Elimnating hoisting for ARROW_UP_OFFSET and ARROW_DOWN_OFFSET */
      (withTiming as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          const transformEndArrowValue = PARAMS.isScrolledToEnd.value ? ARROW_DOWN_OFFSET : 0;
          const transformTopArrowValue = PARAMS.isScrolledToTop.value ? ARROW_UP_OFFSET : 0;

          PARAMS.opacityInterpolationEndArrow.value = transformEndArrowValue;
          PARAMS.opacityInterpolationTopArrow.value = transformTopArrowValue;
        }, ADVANCE_ANIMATION_BY_TIME_TIMING);
      });
    });

    it(`should update opacityInterpolationEndArrow.value to ARROW_DOWN_OFFSET, isScrolling.value to false and
    ensure that top arrow is shown by updating opacityInterpolationTopArrow.value to 0, when the user has scrolled
    to the end`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.isScrolling = useSharedValue(true);
          PARAMS.isScrolledToEnd = useSharedValue(true);
          PARAMS.isScrolledToTop = useSharedValue(false);
          PARAMS.opacityInterpolationTopArrow = useSharedValue(ARROW_UP_OFFSET);
        });

        onScrollArrowAppearanceReaction(PARAMS);

        expect(PARAMS.isScrolling.value).toBeFalsy();

        advanceAnimationByTime(500);

        expect(PARAMS.opacityInterpolationEndArrow.value).toBe(ARROW_DOWN_OFFSET);
        expect(PARAMS.opacityInterpolationTopArrow.value).toBe(0);
      });
    });

    it(`should update opacityInterpolationTopArrow.value to ARROW_UP_OFFSET and update isScrolling.value to false and
    ensure that the bottom arrow is shown by updating opacityInterpolationEndArrow.value to 0, when the user has scrolled
    to the top`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.isScrolling = useSharedValue(true);
          PARAMS.isScrolledToTop = useSharedValue(true);
          PARAMS.isScrolledToEnd = useSharedValue(false);
          PARAMS.opacityInterpolationEndArrow = useSharedValue(ARROW_DOWN_OFFSET);
        });

        onScrollArrowAppearanceReaction(PARAMS);

        expect(PARAMS.isScrolling.value).toBeFalsy();

        advanceAnimationByTime(500);

        expect(PARAMS.opacityInterpolationTopArrow.value).toBe(ARROW_UP_OFFSET);
        expect(PARAMS.opacityInterpolationEndArrow.value).toBe(0);
      });
    });
  });

  describe('Hide scroll arrows if an input field is focused without running any animation', () => {
    beforeEach(() => {
      PARAMS.isInputFieldFocused.value = true;
    });

    it('should hide down arrow by updating opacityInterpolationEndArrow.value to ARROW_DOWN_OFFSET', () => {
      renderHook(() => {
        PARAMS.opacityInterpolationEndArrow = useSharedValue(0);
      });

      onScrollArrowAppearanceReaction(PARAMS);

      expect(PARAMS.opacityInterpolationEndArrow.value).toBe(ARROW_DOWN_OFFSET);
      expect(withTiming).not.toHaveBeenCalled();
    });

    it('should hide up arrow by updating opacityInterpolationTopArrow.value to ARROW_UP_OFFSET', () => {
      renderHook(() => {
        PARAMS.opacityInterpolationTopArrow = useSharedValue(0);
      });

      onScrollArrowAppearanceReaction(PARAMS);

      expect(PARAMS.opacityInterpolationTopArrow.value).toBe(ARROW_UP_OFFSET);
      expect(withTiming).not.toHaveBeenCalled();
    });
  });
});
