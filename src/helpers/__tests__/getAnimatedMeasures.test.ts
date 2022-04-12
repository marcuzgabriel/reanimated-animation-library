import { getAnimatedMeasures } from '../getAnimatedMeasures';

const mockMeasure = jest.fn();
const mockCallback = jest.fn();

const ref = {
  current: {
    measure: mockMeasure,
  },
};

describe('src/helpers/getAnimatedMeasures', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should execute callback with measures width, height, x and y values
  when width is higher than 0`, () => {
    (mockMeasure as jest.Mock).mockImplementation(callback => callback(50, 50, 100, 100));

    getAnimatedMeasures({ ref, callback: mockCallback });

    expect(mockMeasure).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ width: 100, height: 100, x: 50, y: 50 });
  });

  it(`should not execute callback with measures width, height, x and y values
  when width is 0`, () => {
    (mockMeasure as jest.Mock).mockImplementation(callback => callback(50, 50, 0, 100));

    getAnimatedMeasures({ ref, callback: mockCallback });

    expect(mockMeasure).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
