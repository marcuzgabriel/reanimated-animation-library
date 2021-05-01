import Animated from 'react-native-reanimated';

/* https://www.typescriptlang.org/docs/handbook/2/conditional-types.html */
/* https://stackoverflow.com/questions/51521809/typescript-definitions-for-animated-views-style-prop */
/* https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html */
/* https://github.com/software-mansion/react-native-reanimated/blob/master/react-native-reanimated.d.ts */

/* Playing around with typescript with reanimated */
export type AnimatedStyles<T> = {
  [K in keyof T]: K extends 'transform'
    ? Animated.AnimatedTransform
    : K extends 'shadowOffset'
    ? { width: number; height: number }
    : T[K];
};
