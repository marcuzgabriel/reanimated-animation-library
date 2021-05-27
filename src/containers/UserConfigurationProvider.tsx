import React, { useMemo, createContext, useEffect } from 'react';
import {
  DEFAULT_BORDER_RADIUS,
  SCROLL_ARROW_DIMENSIONS,
  SCROLL_ARROW_OFFSET,
  SCROLL_ARROW_FILL,
  ANDROID_FADING_EDGE_LENGTH,
  FADING_EDGE_HEIGHT,
  FADING_EDGE_COLOR_NATIVE,
  FADING_EDGE_COLOR_WEB_TOP,
  FADING_EDGE_COLOR_WEB_BOTTOM,
} from '../constants/styles';
import type { BottomSheetConfiguration } from '../types';

const ENABLE_FEATURE_WHEN_UNDEFINED = true;

export const UserConfigurationContext = createContext<
  BottomSheetConfiguration | Record<string, never>
>({});
export const { Provider } = UserConfigurationContext;
interface Props {
  children: React.ReactNode;
  configuration: BottomSheetConfiguration;
}

const UserConfigurationProvider: React.FC<Readonly<Props>> = ({ configuration, children }) => {
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    scrollArrowTopComponent,
    scrollArrowBottomComponent,
    scrollArrows,
    fadingScrollEdges,
    getCurrentConfigRequest,
  } = configuration;

  const configBorderTopRightRadius = useMemo(
    () => borderTopRightRadius ?? DEFAULT_BORDER_RADIUS,
    [borderTopRightRadius],
  );

  const configBorderTopLeftRadius = useMemo(
    () => borderTopLeftRadius ?? DEFAULT_BORDER_RADIUS,
    [borderTopLeftRadius],
  );

  const configScrollArrows = useMemo(() => {
    const { isEnabled, fill, dimensions, bottomArrowOffset, topArrowOffset } = scrollArrows ?? {};
    const enable = (ENABLE_FEATURE_WHEN_UNDEFINED && typeof isEnabled === 'undefined') ?? isEnabled;

    return {
      isEnabled: !!scrollArrowBottomComponent || !!scrollArrowTopComponent ? false : enable,
      fill: fill ?? SCROLL_ARROW_FILL,
      dimensions: dimensions ?? SCROLL_ARROW_DIMENSIONS,
      topArrowOffset: topArrowOffset ?? SCROLL_ARROW_OFFSET,
      bottomArrowOffset: bottomArrowOffset ?? SCROLL_ARROW_OFFSET,
    };
  }, [scrollArrows, scrollArrowTopComponent, scrollArrowBottomComponent]);

  const configFadingScrollEdges = useMemo(() => {
    const {
      isEnabled,
      androidFadingEdgeLength,
      iOSandWebFadingEdgeHeight,
      nativeBackgroundColor,
      webBackgroundColorTop,
      webBackgroundColorBottom,
    } = fadingScrollEdges ?? {};
    const enable = ENABLE_FEATURE_WHEN_UNDEFINED && typeof isEnabled === 'undefined';

    return {
      isEnabled: isEnabled ?? enable,
      androidFadingEdgeLength: androidFadingEdgeLength ?? ANDROID_FADING_EDGE_LENGTH,
      iOSAndWebFadingEdgeHeight: iOSandWebFadingEdgeHeight ?? FADING_EDGE_HEIGHT,
      nativeBackgroundColor: nativeBackgroundColor ?? FADING_EDGE_COLOR_NATIVE,
      webBackgroundColorTop: webBackgroundColorTop ?? FADING_EDGE_COLOR_WEB_TOP,
      webBackgroundColorBottom: webBackgroundColorBottom ?? FADING_EDGE_COLOR_WEB_BOTTOM,
    };
  }, [fadingScrollEdges]);

  const config = useMemo(
    () => ({
      ...configuration,
      borderTopRightRadius: configBorderTopRightRadius,
      borderTopLeftRadius: configBorderTopLeftRadius,
      scrollArrows: configScrollArrows,
      fadingScrollEdges: configFadingScrollEdges,
    }),
    [
      configuration,
      configBorderTopRightRadius,
      configBorderTopLeftRadius,
      configScrollArrows,
      configFadingScrollEdges,
    ],
  );

  useEffect(() => {
    if (getCurrentConfigRequest) {
      getCurrentConfigRequest(config);
    }
  }, [getCurrentConfigRequest, config]);

  return <Provider value={{ ...config }}>{children}</Provider>;
};

export default UserConfigurationProvider;
