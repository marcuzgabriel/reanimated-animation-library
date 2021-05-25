import React from 'react';
import Animated from 'react-native-reanimated';
interface ScrollArrowDefault {
  fill: string;
  dimensions: number;
  topArrowOffset?: number;
  bottomArrowOffset?: number;
}
interface ScrollArrowCustom {
  componentTopArrow: React.ReactNode;
  componentBottomArrow: React.ReactNode;
}

type ScrollArrow = { enabled: boolean } extends ScrollArrowDefault | ScrollArrowCustom;
export interface BottomSheetConfiguration {
  /**
   * @scrollY
   * Required Animation.SharedValue of number that attaches
   * to the BottomSheet and ensures it works properly
   */
  scrollY: Animated.SharedValue<number>;
  /**
   *  @snapEffectDirection
   *  Prop that connects card to SnapEffect component.
   *  Please see ScrollViewWithSnapEffect.tsx for implementation
   */
  snapEffectDirection?: Animated.SharedValue<string>;
  extraOffset?: number;
  contentComponent: React.ReactNode;
  footerComponent: React.ReactNode;
  headerComponent?: React.ReactNode;
  scrollArrow?: ScrollArrow;
  fadingEdge?: {};
  cardStyle?: {
    maxHeightRatio?: number;
    maxHeightRatioWhenKeyboardIsVisible?: number;
    borderTopRightRadius?: number;
    borderTopLeftRadius?: number;
  };
  morphingArrow?: {
    height?: number;
    topOffset?: number;
  };
  headerStyle?: {
    hitSlop?: number;
  };
  onLayoutRequest?: (cardHeight: number) => void;
}
