import { scrollToPosition } from '../scrollToPosition';

const mockScrollToEnd = jest.fn();
const mockScrollTo = jest.fn();

const ref = {
  current: {
    scrollToEnd: mockScrollToEnd,
    scrollTo: mockScrollTo,
  },
};

describe('src/helpers/scrollToPosition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should execute scrollToEnd when the value to is 'end'`, () => {
    scrollToPosition({ ref, to: 'end' });

    expect(mockScrollToEnd).toHaveBeenCalledTimes(1);
    expect(mockScrollToEnd).toHaveBeenCalledWith({ animated: true });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it(`should execute scrollTo when the value to is not 'end'`, () => {
    scrollToPosition({ ref, to: 'top' });

    expect(mockScrollTo).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
    expect(mockScrollToEnd).not.toHaveBeenCalled();
  });

  it('should not execute any function when ref is undefined', () => {
    scrollToPosition({ ref: undefined, to: 'end' });

    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(mockScrollToEnd).not.toHaveBeenCalled();
  });
});
