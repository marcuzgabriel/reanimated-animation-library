import React from 'react';
import Sheet from '../../components/BottomSheet/Sheet';
import KeyboardProvider from '../../containers/KeyboardProvider';
import ReusablePropsProvider from '../../containers/ReusablePropsProvider';
import UserConfigurationProvider from '../../containers/UserConfigurationProvider';
import type { BottomSheetConfiguration } from '../../types';

const BottomSheet: React.FC<BottomSheetConfiguration> = (props: BottomSheetConfiguration) => (
  <UserConfigurationProvider configuration={props}>
    <ReusablePropsProvider contextName="bottomSheet">
      <KeyboardProvider>
        <Sheet />
      </KeyboardProvider>
    </ReusablePropsProvider>
  </UserConfigurationProvider>
);

export default BottomSheet;
