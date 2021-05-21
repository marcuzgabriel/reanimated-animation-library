import React from 'react';
import Animated from 'react-native-reanimated';

interface ScrollTo {
  ref: React.RefObject<Animated.ScrollView>;
  to: string;
}

export const scrollTo = ({ ref, to }: ScrollTo): void => {
  if (ref?.current) {
    const { scrollToEnd: fnEnd, scrollTo: fnTo }: any = ref.current;
    return to === 'end' ? fnEnd({ animated: true }) : fnTo({ y: 0, animated: true });
  }
};
