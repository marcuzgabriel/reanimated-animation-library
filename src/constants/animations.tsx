import { Easing } from 'react-native-reanimated';

export const DEFAULT_SNAP_POINT_BOTTOM_RATIO = 0.8;
export const DEFAULT_SNAP_POINT_TOP = 0;
export const DEFAULT_SCROLL_SNAP_POINT_RATIO = 0.1;
export const DRAG_RESISTANCE_FACTOR = 0.2;
export const DEFAULT_SNAP_POINT_AUTO_SCROLL_TO_BOTTOM = 50;
export const OFFSET_START_SNAP_TO_BOTTOM = 40;
export const OFFSET_SNAP_POINT_BOTTOM = 30;
export const IS_SCROLLABLE_OFFSET = 1;
export const DEFAULT_TIMING_CONFIG = {
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};
export const DEFAULT_SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 1,
};
