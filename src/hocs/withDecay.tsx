import { defineAnimation, PhysicsAnimationState } from 'react-native-redash';

interface DecayAnimationState extends PhysicsAnimationState {
  lastTimestamp: number;
}

const VELOCITY_EPS = 5;
const DECELATION = 0.997;

export const withDecay = (initialVelocity: number): any => {
  'worklet';
  return defineAnimation<DecayAnimationState>((): any => {
    'worklet';
    const animation = (state: DecayAnimationState, now: number): any => {
      const { velocity, lastTimestamp, current } = state;
      const dt = now - lastTimestamp;
      const v0 = velocity / 1000;
      const kv = Math.pow(DECELATION, dt);
      const v = v0 * kv * 1000;
      const x = current + (v0 * (DECELATION * (1 - kv))) / (1 - DECELATION);

      state.velocity = v;
      state.current = x;
      state.lastTimestamp = now;

      if (Math.abs(v) < VELOCITY_EPS) {
        return true;
      }
      return false;
    };
    const onStart = (state: DecayAnimationState, current: number, now: number): any => {
      state.current = current;
      state.velocity = initialVelocity;
      state.lastTimestamp = now;
    };

    return {
      onFrame: animation,
      onStart,
      velocity: 1,
    };
  });
};
