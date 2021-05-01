import Animated from 'react-native-reanimated';

/* https://www.typescriptlang.org/docs/handbook/2/conditional-types.html */
/* https://stackoverflow.com/questions/51521809/typescript-definitions-for-animated-views-style-prop */
type Values = string | number;
type MaybeAnimated<T> = Animated.SharedValue<T> | T extends T[any] ? number : T;

export type AnimatedStyles<T> = {
  [Key in keyof T]: T[Key] extends Values
    ? MaybeAnimated<T[Key]>
    : T[Key] extends Array<infer U>
    ? Array<AnimatedStyles<U>>
    : AnimatedStyles<T[Key]>;
};
