import React from 'react';
import Animated from 'react-native-reanimated';

interface GetAnimatedMeasureProps {
  ref: React.RefObject<Animated.View> | any;
  callback: ({ ...args }) => any;
}

export const getAnimatedMeasures = ({ ref, callback }: GetAnimatedMeasureProps): void => {
  ref.current.measure((x: number, y: number, width: number, height: number) => {
    if (width > 0) {
      callback({ width, height, x, y });
    }
  });
};
