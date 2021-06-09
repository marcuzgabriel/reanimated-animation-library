import React, { useMemo, createContext, useEffect } from 'react';
import type { BottomSheetConfiguration } from '../types';

/* NOTE: Initially the bottom sheet will present itself
with default configuration if the user havent entered
and configuration. If disabled, then the user will be required
to configure the bottom sheet from scratch */
const DEFAULT_CONFIGURATION_IS_ENABLED = true;

export const UserConfigurationContext = createContext<
  BottomSheetConfiguration | Record<string, never>
>({});
export const { Provider } = UserConfigurationContext;
interface Props {
  children: React.ReactNode;
  configuration: BottomSheetConfiguration;
}

const UserConfigurationProvider: React.FC<Readonly<Props>> = ({ configuration, children }) => {
  const { scrollArrows, fadingScrollEdges, getCurrentConfigRequest } = configuration;

  const configScrollArrows = useMemo(
    () => ({
      ...scrollArrows,
      isEnabled:
        typeof scrollArrows?.isEnabled === 'boolean'
          ? scrollArrows?.isEnabled
          : DEFAULT_CONFIGURATION_IS_ENABLED,
    }),
    [scrollArrows],
  );

  const configFadingScrollEdges = useMemo(
    () => ({
      ...fadingScrollEdges,
      isEnabled:
        typeof fadingScrollEdges?.isEnabled === 'boolean'
          ? fadingScrollEdges.isEnabled
          : DEFAULT_CONFIGURATION_IS_ENABLED,
    }),
    [fadingScrollEdges],
  );

  const config = useMemo(
    () => ({
      ...configuration,
      scrollArrows: configScrollArrows,
      fadingScrollEdges: configFadingScrollEdges,
    }),
    [configuration, configScrollArrows, configFadingScrollEdges],
  );

  useEffect(() => {
    if (getCurrentConfigRequest) {
      getCurrentConfigRequest(config);
    }
  }, [getCurrentConfigRequest, config]);

  return <Provider value={{ ...config }}>{children}</Provider>;
};

export default UserConfigurationProvider;
