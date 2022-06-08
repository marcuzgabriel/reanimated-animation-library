import Animated from 'react-native-reanimated';
import { onOuterScrollReaction } from '../onOuterScrollReaction';
import { onScrollRequestCloseOrOpenCard } from '../onScrollRequestCloseOrOpenCard';
import {
  DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM,
  DEFAULT_SPRING_CONFIG,
} from '../../constants/animations';

const PARAMS = {
  result: 0 as number,
  previous: 0 as number | null,
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  isScrollingUp: { value: false } as Animated.SharedValue<boolean>,
  isScrollingDown: { value: false } as Animated.SharedValue<boolean>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  springConfig: DEFAULT_SPRING_CONFIG,
  outerScrollEvent: {
    isEnabled: false as boolean,
    scrollY: { value: 0 } as Animated.SharedValue<number>,
    autoScrollTriggerLength: 0 as number,
  } as Record<string, boolean | Animated.SharedValue<number> | number> | undefined,
};

jest.mock('../onScrollRequestCloseOrOpenCard');

describe('src/worklets/onOuterScrollReaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('user is scrolling', () => {
    it('should update isScrollingDown.value to true when the result is higher than the previous result', () => {
      PARAMS.result = 1;
      PARAMS.previous = 0;

      onOuterScrollReaction(PARAMS);

      expect(PARAMS.isScrollingDown.value).toBeTruthy();
      expect(PARAMS.isScrollingUp.value).toBeFalsy();
    });

    it('should update isScrollingUp.value to true when the result is less than the previous result', () => {
      PARAMS.result = 0;
      PARAMS.previous = 1;

      onOuterScrollReaction(PARAMS);

      expect(PARAMS.isScrollingUp.value).toBeTruthy();
      expect(PARAMS.isScrollingDown.value).toBeFalsy();
    });

    describe('do not execute auto scrolling event', () => {
      beforeEach(() => {
        PARAMS.isScrollingDown.value = true;
        PARAMS.isScrollingUp.value = false;
      });

      it(`should not execute the auto scroll to bottom request when the scroll result is less than
      DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM`, () => {
        PARAMS.outerScrollEvent = undefined;
        PARAMS.result = DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM - 1;

        onOuterScrollReaction(PARAMS);

        expect(PARAMS.translationY.value).toBe(PARAMS.result);
        expect(onScrollRequestCloseOrOpenCard).not.toHaveBeenCalled();
      });

      it(`should not execute the auto scroll to bottom request when the scroll result is less than
      the user provided outerScrollEvent.autoScrollTriggerLength`, () => {
        const autoScrollTriggerLength = 20;
        PARAMS.outerScrollEvent = { autoScrollTriggerLength };
        PARAMS.result = autoScrollTriggerLength - 1;

        onOuterScrollReaction(PARAMS);

        expect(PARAMS.translationY.value).toBe(PARAMS.result);
        expect(onScrollRequestCloseOrOpenCard).not.toHaveBeenCalled();
      });
    });

    describe('execute auto scrolling event', () => {
      it(`should execute onScrollRequestCloseOrOpenCard when result is higher than
      outerScrollEvent.autoScrollTriggerLength`, () => {
        const autoScrollTriggerLength = 20;
        PARAMS.outerScrollEvent = { autoScrollTriggerLength };
        PARAMS.isScrollingUp.value = false;
        PARAMS.result = autoScrollTriggerLength + 1;

        onOuterScrollReaction(PARAMS);

        expect(onScrollRequestCloseOrOpenCard).toHaveBeenCalled();
      });

      it('should execute onScrollRequestCloseOrOpenCard when user is scrolling up', () => {
        PARAMS.isScrollingUp.value = true;
        PARAMS.isScrollingDown.value = false;

        onOuterScrollReaction(PARAMS);

        expect(onScrollRequestCloseOrOpenCard).toHaveBeenCalled();
      });

      it('should execute onScrollRequestCloseOrOpenCard when card is collapsed', () => {
        PARAMS.isScrollingUp.value = false;
        PARAMS.isCardCollapsed.value = true;

        onOuterScrollReaction(PARAMS);

        expect(onScrollRequestCloseOrOpenCard).toHaveBeenCalled();
      });
    });
  });

  describe('user is not scrolling', () => {
    it(`should execute onScrollRequestOrOpenCard if outerScrollEvent.scrollY.value is 0 and the card is
    collapsed to ensure that the card is always open as a safety behaviour`, () => {
      const scrollY = 0;
      PARAMS.outerScrollEvent = { scrollY: { value: scrollY } };
      PARAMS.result = 0;
      PARAMS.previous = 0;
      PARAMS.isCardCollapsed.value = true;

      onOuterScrollReaction(PARAMS);

      expect(onScrollRequestCloseOrOpenCard).toHaveBeenCalled();
    });
  });
});
