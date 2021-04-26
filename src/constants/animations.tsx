import { DEFAULT_CARD_HEIGHT } from './styles';

export const DEFAULT_SNAP_POINT_BOTTOM = DEFAULT_CARD_HEIGHT * 0.75;
export const DEFAULT_SNAP_POINT_TOP = 0;
export const DEFAULT_SCROLL_SNAP_POINT_RATIO = 0.1;
export const DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM = 50;
export const DEFAULT_TIMING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 1,
};
