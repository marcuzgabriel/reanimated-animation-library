import { renderHook } from '@testing-library/react-hooks';
import Animated, { useSharedValue, runOnJS } from 'react-native-reanimated';
import { onSnappableReaction } from '../onSnappableReaction';

const PARAMS = {
  contentHeight: { value: 0 } as Animated.SharedValue<number>,
  isSnapEffectActiveState: false as boolean,
  isCardOverlappingContent: false as boolean,
  windowHeight: 0 as number,
  offsetAddition: 0 as number,
};

const mockSetIsSnapEffectActiveState = jest.fn();

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  runOnJS: (): typeof jest.fn => mockSetIsSnapEffectActiveState,
}));

describe('src/worklets/onSnappableReaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should update setIsSnapEffectActiveState to true when the content is not scrollable and
  the bottomSheet is overlapping the background content`, () => {
    renderHook(() => {
      PARAMS.contentHeight = useSharedValue(50);
      PARAMS.offsetAddition = 50;
      PARAMS.windowHeight = 100;
      PARAMS.isCardOverlappingContent = true;
    });

    onSnappableReaction({ ...PARAMS, setIsSnapEffectActiveState: mockSetIsSnapEffectActiveState });

    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledTimes(1);
    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledWith(true);
  });

  it('should update setIsSnapEffectActiveState to false when the content is not scrollable', () => {
    renderHook(() => {
      PARAMS.contentHeight = useSharedValue(100);
      PARAMS.offsetAddition = 50;
      PARAMS.windowHeight = 100;
    });

    onSnappableReaction({ ...PARAMS, setIsSnapEffectActiveState: mockSetIsSnapEffectActiveState });

    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledTimes(1);
    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledWith(false);
  });

  it('should update setIsSnapEffectActiveState to false when isSnapEffectActiveState is true', () => {
    renderHook(() => {
      PARAMS.contentHeight = useSharedValue(0);
      PARAMS.isCardOverlappingContent = false;
      PARAMS.offsetAddition = 0;
      PARAMS.windowHeight = 0;
      PARAMS.isSnapEffectActiveState = true;
    });

    onSnappableReaction({ ...PARAMS, setIsSnapEffectActiveState: mockSetIsSnapEffectActiveState });

    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledTimes(1);
    expect(mockSetIsSnapEffectActiveState).toHaveBeenCalledWith(false);
  });
});
