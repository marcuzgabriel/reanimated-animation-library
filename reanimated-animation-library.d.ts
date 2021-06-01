// Project: https://github.com/marcuzgabriel/reanimated-animation-library
// Typescript Version: 3.7.4

declare module '@marcuzgabriel/reanimated-animation-library' {
  import React from 'react';
  import { ScrollViewProps } from 'react-native';

  export interface BottomSheetConfiguration {
    scrollY: Animated.SharedValue<number>;
    /**
     *  @snapEffectDirection ---
     *  Prop that connects card to SnapEffect component.
     *  Please see ScrollViewWithSnapEffect.tsx for implementation
     */
    snapEffectDirection?: Animated.SharedValue<string>;
    snapPointBottom: number;
    extraOffset?: number;
    borderTopRightRadius?: number;
    borderTopLeftRadius?: number;
    backgroundColor?: string;
    contentComponent: React.ReactNode;
    footerComponent?: React.ReactNode;
    headerComponent?: React.ReactNode;
    scrollArrowTopComponent?: React.ReactNode;
    scrollArrowBottomComponent?: React.ReactNode;
    scrollArrows?: {
      isEnabled: boolean;
      fill?: string;
      dimensions?: number;
      topArrowOffset?: number;
      bottomArrowOffset?: number;
    };
    extraSnapPointBottomOffset?: number;
    header?: {
      component?: React.ReactNode;
      hasMorphingArrow?: boolean;
      hitSlop?: number;
      height?: number;
      backgroundColor?: string;
    };
    morphingArrow?: {
      isEnabled: boolean;
      height?: number;
      width?: number;
      offset?: number;
      fill?: string;
    };
    fadingScrollEdges?: {
      isEnabled: boolean;
      androidFadingEdgeLength?: number;
      iOSandWebFadingEdgeHeight?: number;
      nativeBackgroundColor: string;
      webBackgroundColorTop: Record<string, string>;
      webBackgroundColorBottom: Record<string, string>;
    };
    getCurrentConfigRequest?: (config: Record<string, any>) => void;
    onLayoutRequest?: (cardHeight: number) => void;
  }

  // Input field component types
  type StyleTypeFix<T> = {
    [K in keyof T]: K extends 'justifyContent' ? any : K extends 'textAlign' ? any : T[K];
  };

  interface InputFieldProps extends TextInputProps {
    uniqueId: number | string;
    style: StyleTypeFix<TextStyle>;
  }
  interface ScrollViewKeyboardAvoidProps extends ScrollViewProps {
    panGestureType?: Animated.SharedValue<number>;
    contentHeightWHenKeyboardIsVisible?: Animated.SharedValue<number>;
    disableScrollAnimation?: boolean;
    keyboardAvoidBottomMargin?: number;
    isScrollingCard?: Animated.SharedValue<boolean>;
    isInputFieldFocused?: Animated.SharedValue<boolean>;
    isKeyboardAvoidDisabled?: boolean;
    contextName?: string;
    scrollArrows?: scrollArrows;
    children: React.ReactNode;
    onIsInputFieldFocusedRequest?: (status: boolean, availableHeight: number) => void;
    gestureHandler?: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  }

  interface SnapEffectProps {
    children: React.ReactNode;
    cardHeight: Animated.SharedValue<number>;
    snapEffectDirection: Animated.SharedValue<string>;
    offsetAddition?: number;
  }

  // Components
  export function BottomSheet<P extends BottomSheetConfiguration>(props: P): React.ReactElement<P>;
  export function InputField<P extends InputFieldProps>(props: P): React.ReactElement<P>;
  export function SnapEffect<P extends SnapEffectProps>(props: P): React.ReactElement<P>;
  export function ScrollViewWithSnapEffect(): React.ReactElement;
  export function ScrollViewKeyboardAvoid<P extends ScrollViewKeyboardAvoidProps>(
    props: P,
  ): React.ReactElement<P>;
}
