import React from 'react';
import Animated from 'react-native-reanimated';

interface ScrollToPositionArgs {
  animated: boolean;
  y?: number;
}

interface ScrollToPositionFunctions {
  scrollToEnd?: (args: ScrollToPositionArgs) => void;
  scrollTo?: (args: ScrollToPositionArgs) => void;
}

/* NOTE: Had troubles with this type. It is a forward ref
with functions, but it complains when typing it so. */
interface ScrollToPosition {
  ref?: React.ForwardedRef<Animated.ScrollView> | any;
  to: string;
}

export const scrollToPosition = ({ ref, to }: ScrollToPosition): void => {
  if (ref?.current) {
    const { scrollToEnd: fnEnd, scrollTo: fnTo } = ref.current as ScrollToPositionFunctions;

    if (fnEnd && fnTo) {
      return to === 'end' ? fnEnd({ animated: true }) : fnTo({ y: 0, animated: true });
    }
  }
};
