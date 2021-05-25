import React, { createContext } from 'react';
import { BottomSheetConfiguration } from 'types';

export const UserConfigurationContext = createContext<
  BottomSheetConfiguration | Record<string, never>
>({});
export const { Provider } = UserConfigurationContext;
interface Props {
  children: React.ReactNode;
  configuration: BottomSheetConfiguration;
}

const UserConfigurationProvider: React.FC<Readonly<Props>> = ({ configuration, children }) => {
  return <Provider value={{ ...configuration }}>{children}</Provider>;
};

export default UserConfigurationProvider;
