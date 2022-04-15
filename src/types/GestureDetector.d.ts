import React from 'react';
import {
  GestureType,
  HandlerCallbacks,
} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture.d.ts';
import { SharedValue } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper.d.ts';
import { ComposedGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition.d.ts';

export declare interface GestureConfigReference {
  config: GestureType[];
  animatedEventHandler: unknown;
  animatedHandlers: SharedValue<HandlerCallbacks<Record<string, unknown>>[] | null> | null;
  firstExecution: boolean;
  useReanimatedHook: boolean;
}

interface GestureDetectorProps {
  gesture?: ComposedGesture | GestureType;
  children?: React.ReactNode;
}

export declare const GestureDetector: React.FunctionComponent<GestureDetectorProps>;
export {};
