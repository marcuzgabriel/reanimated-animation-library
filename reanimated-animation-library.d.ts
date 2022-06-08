// Project: https://github.com/marcuzgabriel/reanimated-animation-library
// Typescript Version: 3.7.4

declare module '@marcuzgabriel/reanimated-animation-library' {
  import React from 'react';
  import Animated from 'react-native-reanimated';
  import { ScrollViewProps as ScrollViewNativeProps } from 'react-native';

  export interface ScrollArrows {
    isEnabled: boolean;
    fill?: string;
    dimensions?: number;
    topArrowOffset?: number;
    bottomArrowOffset?: number;
  }

  export interface FadingScrollEdges {
    isEnabled?: boolean;
    androidFadingEdgeLength?: number;
    iOSandWebFadingEdgeHeight?: number;
    nativeBackgroundColor?: string;
    webBackgroundColorTop?: Record<string, string>;
    webBackgroundColorBottom?: Record<string, string>;
  }

  export interface BottomSheetConfiguration {
    isBottomSheetInactive?: boolean;
    initializeBottomSheetAsClosed?: boolean;
    pressableSafeAreaToContent?: number;
    webBoxShadow?: {
      offset: number;
      opacity: number;
    };
    smoothAppearance?: {
      waitForContent: boolean;
      emptyContentHeight?: number;
    };
    contentHeightWhenKeyboardIsVisible: {
      takeUpAllAvailableSpace?: boolean;
      resizeHeightTrigger?: number;
      resizeHeight?: number;
      offset?: number;
      closeIcon?: {
        topOffset?: number;
        rightOffset?: number;
        icon: () => React.ReactNode;
      };
    };
    snapEffectDirection?: Animated.SharedValue<string>;
    snapPointBottom: number;
    springConfig?: {
      damping?: number;
      mass?: number;
      stiffness?: number;
      overshootClamping?: boolean;
      restSpeedThreshold?: number;
      restDisplacementThreshold?: number;
    };
    extraOffset?: number;
    borderTopRightRadius?: number;
    borderTopLeftRadius?: number;
    backgroundColor?: string;
    contentComponent: React.ReactNode;
    footerComponent?: React.ReactNode;
    headerComponent?: React.ReactNode;
    hideFooterOnCardCollapse?: {
      isEnabled?: boolean;
      offset?: number;
    };
    hideContentOnCardCollapse?: {
      isEnabled?: boolean;
      offset?: number;
    };
    scrollArrowTopComponent?: React.ReactNode;
    scrollArrowBottomComponent?: React.ReactNode;
    scrollArrows?: ScrollArrows;
    extraSnapPointBottomOffset?: number;
    keyboardAvoidBottomMargin?: number;
    maxHeightRatio?: number;
    header?: {
      height?: number;
    };
    morphingArrow?: {
      isEnabled?: boolean;
      offset?: number;
      fill?: string;
      marginTop?: number;
    };
    fadingScrollEdges?: FadingScrollEdges;
    outerScrollEvent?: {
      isEnabled?: boolean;
      scrollY?: Animated.SharedValue<number>;
      autoScrollTriggerLength?: number;
    };
    offsetAddition?: number;
    testID?: string;
    openBottomSheetRequest?: {
      isEnabled: boolean;
      callback: (cb: () => void) => void;
    };
    closeBottomSheetRequest?: {
      isEnabled: boolean;
      callback: (cb: () => void) => void;
    };
    onLayoutRequest?: (cardHeight: number) => void;
    getCurrentConfigRequest?: (config: BottomSheetConfiguration) => BottomSheetConfiguration;
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
  export interface ContextPropsBottomSheet {
    headerHeight: Animated.SharedValue<number>;
    footerHeight: Animated.SharedValue<number>;
    contentHeight: Animated.SharedValue<number>;
    cardHeight: Animated.SharedValue<number>;
    hideFooterInterpolation: Animated.SharedValue<number>;
    scrollViewRef: React.RefObject<Animated.ScrollView>;
    scrollViewHeight: Animated.SharedValue<number>;
    scrollViewWidth: Animated.SharedValue<number>;
    scrollingLength: Animated.SharedValue<number>;
    translationY: Animated.SharedValue<number>;
    footerTranslationY: Animated.SharedValue<number>;
    scrollY: Animated.SharedValue<number>;
    smoothAppearanceClock: Animated.SharedValue<number>;
    isScrollable: Animated.SharedValue<boolean>;
    isScrolledToTop: Animated.SharedValue<boolean>;
    isScrolledToEnd: Animated.SharedValue<boolean>;
    isInputFieldFocused: Animated.SharedValue<boolean>;
    isKeyboardVisible: Animated.SharedValue<boolean>;
    onIsInputFieldFocusedRequest?: (status: boolean, availableHeight: number) => void;
  }

  export interface ContextPropsScrollViewKeyboardAvoid {
    scrollViewRef: React.RefObject<Animated.ScrollView>;
    scrollViewHeight: Animated.SharedValue<number>;
    scrollingLength: Animated.SharedValue<number>;
    scrollY: Animated.SharedValue<number>;
    isInputFieldFocused: Animated.SharedValue<boolean>;
    isScrollable: Animated.SharedValue<boolean>;
    isScrolledToTop: Animated.SharedValue<boolean>;
    isScrolledToEnd: Animated.SharedValue<boolean>;
  }

  export interface ContextPropsKeyboard {
    isKeyboardVisible: Animated.SharedValue<boolean>;
    keyboardHeight: Animated.SharedValue<number>;
    keyboardDuration: Animated.SharedValue<number>;
  }

  export interface InputFieldProps {
    identifier: string | number;
    y: number;
  }

  export interface ContextPropsKeyboardAvoidingView {
    inputFields: Animated.SharedValue<InputFieldProps[]>;
    selectedInputFieldPositionY: Animated.SharedValue<number>;
  }

  /* NOTE: main type for all types associated with ScrollView */
  export interface ScrollViewProps
    extends ScrollViewNativeProps,
      Pick<BottomSheetConfiguration, 'contentHeightWhenKeyboardIsVisible'> {
    scrollViewRef?: React.ForwardedRef<Animated.ScrollView>;
    translationYValues?: Animated.SharedValue<number>[];
    fadingScrollEdges?: FadingScrollEdges;
    scrollArrows?: ScrollArrows;
    scrollTo?: (to: string) => void;
    onContentSizeChange?: (width: number, height: number) => void;
    onIsInputFieldFocusedRequest?: (status: boolean, availableHeight: number) => void;
    children: React.ReactNode;
    isKeyboardAvoidDisabled?: boolean;
    keyboardAvoidBottomMargin?: number;
    connectScrollViewMeasuresToAnimationValues?: Record<
      string,
      Animated.SharedValue<number | boolean | undefined>
    >;
  }

  export interface ScrollArrowProps
    extends Pick<ScrollViewProps, 'scrollViewRef' | 'scrollArrows' | 'scrollTo'> {
    contentHeight: Animated.SharedValue<number>;
    scrollY: Animated.SharedValue<number>;
    scrollViewHeight: Animated.SharedValue<number>;
    scrollViewWidth: Animated.SharedValue<number>;
    scrollingLength: Animated.SharedValue<number>;
    isScrolledToTop: Animated.SharedValue<boolean>;
    isScrolledToEnd: Animated.SharedValue<boolean>;
    isScrollable: Animated.SharedValue<boolean>;
    isInputFieldFocused: Animated.SharedValue<boolean>;
    position: string;
  }

  export interface KeyboardAvoidingViewProviderProps
    extends Pick<
      ScrollViewProps,
      | 'translationYValues'
      | 'onIsInputFieldFocusedRequest'
      | 'isKeyboardAvoidDisabled'
      | 'keyboardAvoidBottomMargin'
    > {
    contentHeight: Animated.SharedValue<number>;
    scrollViewHeight: Animated.SharedValue<number>;
    isInputFieldFocused: Animated.SharedValue<boolean>;
    children: React.ReactNode;
  }

  export interface ScrollToPositionArgs {
    animated: boolean;
    y?: number;
  }

  export interface ScrollToPositionFunctions {
    scrollToEnd?: (args: ScrollToPositionArgs) => void;
    scrollTo?: (args: ScrollToPositionArgs) => void;
  }

  export interface ScrollToProps {
    ref?: React.ForwardedRef<Animated.ScrollView> | any;
    to: string;
  }

  export interface SnapEffectProps {
    children: React.ReactNode;
    cardHeight: Animated.SharedValue<number>;
    snapEffectDirection: Animated.SharedValue<string>;
    isScrollableOffset?: number;
    isStaticOffset?: number;
    disableSnapEffect?: boolean;
  }

  // Helpers
  export function scrollToPosition<P extends ScrollToProps>({ ref, to }: P): void;

  // Components
  export function BottomSheet<P extends BottomSheetConfiguration>(props: P): React.ReactElement<P>;
  export function InputField<P extends InputFieldProps>(props: P): React.ReactElement<P>;
  export function SnapEffect<P extends SnapEffectProps>(props: P): React.ReactElement<P>;
  export function ScrollViewWithSnapEffect(): React.ReactElement;
  export function ScrollViewKeyboardAvoid<P extends ScrollViewProps>(
    props: P,
  ): React.ReactElement<P>;
}
