import {
  defineAnimation,
  PhysicsAnimationState,
  AnimationState,
  Animation,
} from 'react-native-redash';

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

export const withFriction = ({ value, initialVelocity, friction }: Props): number => {
  'worklet';

  return defineAnimation<FrictionAnimationState>(
    (): Pick<
      Animation<FrictionAnimationState, AnimationState>,
      'onFrame' | 'onStart' | 'callback'
    > => {
      'worklet';
      const animation = (state: FrictionAnimationState, now: number): boolean => {
        const { velocity, lastTimestamp } = state;
        const dt = now - lastTimestamp;
        const v0 = velocity / 1000;
        const kv = Math.pow(DECELATION, dt);
        const v = v0 * kv * 1000;

        state.current = value * 0.52 * Math.pow(1 - friction, 2);
        state.velocity = v;
        state.lastTimestamp = now;

        if (Math.abs(v) < VELOCITY_EPS) {
          return true;
        }

        return false;
      };

      const onStart = (state: FrictionAnimationState, current: number, now: number): void => {
        state.current = current;
        state.velocity = initialVelocity;
        state.lastTimestamp = now;
      };

      return {
        onFrame: animation,
        onStart,
      };
    },
  );
};
