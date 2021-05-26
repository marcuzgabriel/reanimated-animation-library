import React from 'react';
import Animated from 'react-native-reanimated';
interface ScrollArrowsDefaultProps extends Partial<ScrollArrowsCustomProps> {
  fill: string;
  dimensions: number;
  topArrowOffset?: number;
  bottomArrowOffset?: number;
}
interface ScrollArrowsCustomProps extends Partial<ScrollArrowsDefaultProps> {
  componentTopArrow: React.ReactNode;
  componentBottomArrow: React.ReactNode;
}

type ScrollArrows = ScrollArrowsDefaultProps | ScrollArrowsCustomProps;

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
  contentComponent: React.ReactNode;
  footerComponent: React.ReactNode;
  headerComponent?: React.ReactNode;
  /**
   * @scrollArrows ---
   * Minimum object structure requirement. The property
   * has to be one of the following objects:
   *  @param scrollArrow
   * ```JSON
   ** { fill, dimensions, ... } or
   ** { componentTopArrow, componentBottomArrow }
   * ```
   *
   */
  scrollArrows?: ScrollArrows;
  extraSnapPointBottomOffset?: number;
  fadingEdge?: {};
  cardStyle?: {
    maxHeightRatio?: number;
    maxHeightRatioWhenKeyboardIsVisible?: number;
    borderTopRightRadius?: number;
    borderTopLeftRadius?: number;
  };
  morphingArrow?: {
    topOffset?: number;
  };
  header?: {
    component?: React.ReactNode;
    hasMorphingArrow?: boolean;
    hitSlop?: number;
    height?: number;
    backgroundColor?: string;
  };
  onLayoutRequest?: (cardHeight: number) => void;
}
