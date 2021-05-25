import React, { useState, createContext } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { BottomSheetConfiguration } from 'types';

export const UserConfigurationContext = createContext<Record<string, any>>({});
export const { Provider } = UserConfigurationContext;

interface Props {
  children: React.ReactNode;
  type: string;
  configuration: BottomSheetConfiguration;
}

const UserConfigurationProvider: React.FC<Props> = ({ configuration, children }) => {
  const [config, setConfig] = useState<BottomSheetConfiguration>(configuration);

  return <Provider value={{ ...config }}>{children}</Provider>;
};

export default UserConfigurationProvider;
