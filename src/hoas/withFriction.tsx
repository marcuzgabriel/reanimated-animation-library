import { defineAnimation, PhysicsAnimationState } from 'react-native-redash';

interface Props {
  value: number;
  initialVelocity: number;
  friction: number;
}

interface FrictionAnimationState extends PhysicsAnimationState {
  lastTimestamp: number;
}

const VELOCITY_EPS = 5;
const DECELATION = 0.997;

export const withFriction = ({ value, initialVelocity, friction }: Props): any => {
  'worklet';
  return defineAnimation<FrictionAnimationState>((): any => {
    'worklet';
    const animation = (state: FrictionAnimationState, now: number): any => {
      const { velocity, lastTimestamp } = state;
      const dt = now - lastTimestamp;
      const v0 = velocity / 1000;
      const kv = Math.pow(DECELATION, dt);
      const v = v0 * kv * 1000;

      /* Note: https://www.youtube.com/watch?v=VZ73JdhjFC8: min 6:36 friction formula */
      state.current = value * 0.52 * Math.pow(1 - friction, 2);
      state.velocity = v;
      state.lastTimestamp = now;

      if (Math.abs(v) < VELOCITY_EPS) {
        return true;
      }
      return false;
    };
    const onStart = (state: FrictionAnimationState, current: number, now: number): any => {
      state.current = current;
      state.velocity = initialVelocity;
      state.lastTimestamp = now;
    };

    return {
      onFrame: animation,
      onStart,
    };
  });
};
