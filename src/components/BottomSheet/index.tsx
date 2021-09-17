import React from 'react';
import Sheet from '../../components/BottomSheet/Sheet';
import ReusablePropsProvider from '../../containers/ReusablePropsProvider';
import UserConfigurationProvider from '../../containers/UserConfigurationProvider';
import type { BottomSheetConfiguration } from '../../types';

const BottomSheet: React.FC<BottomSheetConfiguration> = (props: BottomSheetConfiguration) => (
  <UserConfigurationProvider configuration={props}>
    <ReusablePropsProvider contextName="bottomSheet">
      <Sheet />
    </ReusablePropsProvider>
  </UserConfigurationProvider>
);

export default BottomSheet;
