import { Platform } from 'react-native';
import { Gesture, PanGesture, NativeGesture, TapGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import { getPanGestureOnBegin, getPanGestureOnUpdate, getPanGestureOnEnd } from './gestures';
import type { BottomSheetConfiguration } from '../types';

interface GetGesturesParams {
  gestureHandlerParams: any;
  isBottomSheetInactive?: boolean;
}

export interface GestureParams {
  isInputFieldFocused: SharedValue<boolean>;
  isPanning: SharedValue<boolean>;
  isPanningDown: SharedValue<boolean>;
  isCardCollapsed: SharedValue<boolean>;
  isAnimationRunning: SharedValue<boolean>;
  isIOS: boolean;
  isWeb: boolean;
  isScrollable: SharedValue<boolean>;
  prevDragY: SharedValue<number>;
  dragY: SharedValue<number>;
  translationY: SharedValue<number>;
  scrollOffset: SharedValue<number>;
  springConfig: BottomSheetConfiguration['springConfig'];
  startY: SharedValue<number>;
  snapPointBottom: SharedValue<number>;
  innerScrollY: SharedValue<number>;
}

export const getGestures = ({
  gestureHandlerParams,
  isBottomSheetInactive = false,
}: GetGesturesParams): Record<string, PanGesture | NativeGesture | TapGesture> => {
  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';

  const gestureParams: GestureParams = {
    ...gestureHandlerParams,
    isIOS,
    isWeb,
  };

  const panGestureOnBegin = getPanGestureOnBegin(gestureParams);
  const panGestureOnUpdate = getPanGestureOnUpdate(gestureParams);
  const panGestureOnEnd = getPanGestureOnEnd(gestureParams);

  const panGestureHeader = Gesture.Pan()
    .enabled(!isBottomSheetInactive)
    .onBegin(panGestureOnBegin)
    .onUpdate(e => panGestureOnUpdate(e, true))
    .onEnd(panGestureOnEnd)
    .withTestId('panGestureHeader');

  /* NOTE: .enabled property can't handle an || statement.
  It causes wierd overwrite behaviour on web  */
  const panGestureContent = isBottomSheetInactive
    ? Gesture.Pan().enabled(false).withTestId('panGestureContent')
    : Gesture.Pan()
        .enabled(!isWeb)
        .onBegin(panGestureOnBegin)
        .onUpdate(panGestureOnUpdate)
        .onEnd(panGestureOnEnd)
        .withTestId('panGestureContent');

  const scrollViewNativeGesture = Gesture.Native().enabled(!isWeb);

  return {
    panGestureHeader,
    panGestureContent,
    scrollViewNativeGesture,
  };
};
