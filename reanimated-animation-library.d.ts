// Project: https://github.com/marcuzgabriel/reanimated-animation-library
// Typescript Version: 3.7.4

declare module '@marcuzgabriel/reanimated-animation-library' {
  import React from 'react';
  export interface BottomSheetConfiguration {
    /**
     * @scrollY ---
     * Required Animation.SharedValue of number that attaches to
     * the BottomSheet and ensures it works properly
     */
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
    contentComponent: React.ReactNode;
    footerComponent?: React.ReactNode;
    headerComponent?: React.ReactNode;
    scrollArrowTopComponent?: React.ReactNode;
    scrollArrowBottomComponent?: React.ReactNode;
    scrollArrows?: {
      isEnabled?: boolean;
      fill?: string;
      dimensions?: number;
      topArrowOffset?: number;
      bottomArrowOffset?: number;
    };
    extraSnapPointBottomOffset?: number;
    cardStyle?: {
      maxHeightRatio?: number;
      maxHeightRatioWhenKeyboardIsVisible?: number;
      borderTopRightRadius?: number;
      borderTopLeftRadius?: number;
    };
    header?: {
      component?: React.ReactNode;
      hasMorphingArrow?: boolean;
      hitSlop?: number;
      height?: number;
      backgroundColor?: string;
    };
    morphingArrow?: {
      isEnabled?: boolean;
      height?: number;
      width?: number;
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

  // Components
  export function BottomSheet<P extends BottomSheetConfiguration>(props: P): React.ReactElement<P>;
  export function InputField<P extends InputFieldProps>(props: P): React.ReactElement<P>;
  export function ScrollViewWithSnapEffect(): React.ReactElement;
}
