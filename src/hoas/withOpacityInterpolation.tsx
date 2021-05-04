import Animated, { interpolate } from 'react-native-reanimated';
import {
  defineAnimation,
  animationParameter,
  AnimationParameter,
  PhysicsAnimationState,
  AnimationState,
} from 'react-native-redash';

/* Example on how to make your own higher-order animation
with reanimated and react-native-redash. This HOA
wraps a current animation, and creates an opacity
interpolation at the same time.

Ultimately a HOA's best purpose is to create a controlled
animation environment. Lets say you want to run certain
activities starting one or multiple animation(s).
Then a HOC can come in very handy. */

interface OpacityInterpolation extends PhysicsAnimationState {
  opacity: number;
  lastTimestamp: number;
}

export const withOpacityInterpolation = (
  animationParam: AnimationParameter<AnimationState>,
  sharedValue: Animated.SharedValue<number>,
  toValue: number,
): any => {
  'worklet';

  return defineAnimation<AnimationState>((): any => {
    'worklet';
    const simultanouslyAnimation = animationParameter(animationParam);
    const animation = (state: AnimationState, now: number): any => {
      const finished = simultanouslyAnimation.onFrame(simultanouslyAnimation, now);
      const { current } = simultanouslyAnimation;

      state.current = current;
      sharedValue.value = interpolate(current, [0, toValue], [1, 0]);

      return finished;
    };

    const onStart = (
      _state: OpacityInterpolation,
      value: number,
      now: number,
      previousAnimation: AnimationState,
    ): any => {
      simultanouslyAnimation.onStart(simultanouslyAnimation, value, now, previousAnimation);
    };

    return {
      onFrame: animation,
      onStart,
    };
  });
};
