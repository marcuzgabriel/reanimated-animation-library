import Animated, { useSharedValue } from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-hooks';
import { onInitializationCloseRequest } from '../onInitializationCloseRequest';
import { DEFAULT_SPRING_CONFIG } from '../../constants/animations';

const {
  withReanimatedTimer,
  advanceAnimationByTime,
} = require('react-native-reanimated/lib/reanimated2/jestUtils');

const ADVANCE_ANIMATION_BY_TIME_SPRING = 800;
const PARAMS = {
  isCardCollapsed: { value: false } as Animated.SharedValue<boolean>,
  isInitializedAsClosed: { value: false } as Animated.SharedValue<boolean>,
  isAnimationRunning: { value: false } as Animated.SharedValue<boolean>,
  snapEffectDirection: { value: '' } as Animated.SharedValue<string>,
  translationY: { value: 0 } as Animated.SharedValue<number>,
  snapPointBottom: { value: 0 } as Animated.SharedValue<number>,
  springConfig: DEFAULT_SPRING_CONFIG,
};

describe('src/worklets/onInitializationCloseRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update isCollapsed.value to true', () => {
    onInitializationCloseRequest(PARAMS);

    expect(PARAMS.isCardCollapsed.value).toBeTruthy();
  });

  it('should reset snapEffectDirection.value to an empty string', () => {
    renderHook(() => {
      PARAMS.snapEffectDirection = useSharedValue('down');
    });

    onInitializationCloseRequest(PARAMS);

    expect(PARAMS.snapEffectDirection.value).toBe('');
  });

  describe('withSpring animation', () => {
    it(`should execute animation when snapPointBottom.value is heigher than 0 and translationY.value
    is not equal to snapPointBottom.value`, () => {
      withReanimatedTimer(() => {
        renderHook(() => {
          PARAMS.isInitializedAsClosed = useSharedValue(false);
          PARAMS.snapPointBottom = useSharedValue(1);
          PARAMS.translationY = useSharedValue(2);
        });

        onInitializationCloseRequest(PARAMS);

        expect(PARAMS.isAnimationRunning.value).toBeTruthy();

        advanceAnimationByTime(ADVANCE_ANIMATION_BY_TIME_SPRING);

        expect(PARAMS.translationY.value).toBe(PARAMS.translationY.value);
        expect(PARAMS.isInitializedAsClosed.value).toBeTruthy();
        expect(PARAMS.isAnimationRunning.value).toBeFalsy();
      });
    });

    it('should not execute animation when snapPointBottom.value is 0', () => {
      renderHook(() => {
        PARAMS.isInitializedAsClosed = useSharedValue(false);
        PARAMS.snapPointBottom = useSharedValue(0);
        PARAMS.translationY = useSharedValue(2);
      });

      onInitializationCloseRequest(PARAMS);

      expect(PARAMS.isAnimationRunning.value).toBeFalsy();
    });

    it('should not execute animation when translationY.value is snapPointBottom.value', () => {
      renderHook(() => {
        PARAMS.isInitializedAsClosed = useSharedValue(false);
        PARAMS.snapPointBottom = useSharedValue(1);
        PARAMS.translationY = useSharedValue(1);
      });

      onInitializationCloseRequest(PARAMS);

      expect(PARAMS.isAnimationRunning.value).toBeFalsy();
    });
  });
});
