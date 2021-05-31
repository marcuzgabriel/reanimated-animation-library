import { ScrollViewProps } from 'react-native';
import { GestureEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
interface scrollArrows {
  isEnabled?: boolean;
  fill: string;
  dimensions: number;
  topArrowOffset: number;
  bottomArrowOffset: number;
}
export interface BottomSheetConfiguration {
  scrollY?: Animated.SharedValue<number>;
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
  scrollArrows?: scrollArrows;
  extraSnapPointBottomOffset?: number;
  keyboardAvoidBottomMargin?: number;
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
    isEnabled?: boolean;
    androidFadingEdgeLength?: number;
    iOSandWebFadingEdgeHeight?: number;
    nativeBackgroundColor?: string;
    webBackgroundColorTop?: Record<string, string>;
    webBackgroundColorBottom?: Record<string, string>;
  };
  offsetAddition?: number;
  getCurrentConfigRequest?: (config: Record<string, any>) => void;
  onLayoutRequest?: (cardHeight: number) => void;
}
export interface MixedScrollViewProps extends ScrollViewProps {
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
export interface ScrollProps {
  scrollY?: Animated.SharedValue<number>;
  scrollViewHeight?: Animated.SharedValue<number>;
  scrollingLength?: Animated.SharedValue<number>;
  isScrolledToTop?: Animated.SharedValue<boolean>;
  isScrolledToEnd?: Animated.SharedValue<boolean>;
  isScrollable?: Animated.SharedValue<boolean>;
}

export interface OnScrollArrowAppearanceReaction {
  contentHeight: Animated.SharedValue<number>;
  scrollViewHeight: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
}
