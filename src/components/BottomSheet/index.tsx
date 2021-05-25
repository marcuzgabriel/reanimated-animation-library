import React from 'react';
import Animated from 'react-native-reanimated';
import Sheet from 'components/BottomSheet/Sheet';
import KeyboardProvider from 'containers/KeyboardProvider';
import ReusablePropsProvider from 'containers/ReusablePropsProvider';
import UserConfigurationProvider from 'containers/UserConfigurationProvider';
import { BottomSheetConfiguration } from 'types';

const BottomSheet: React.FC<BottomSheetConfiguration> = (props: BottomSheetConfiguration) => (
  <UserConfigurationProvider configuration={props} type="bottomSheet">
    <KeyboardProvider>
      <ReusablePropsProvider>
        <Sheet {...props} />
      </ReusablePropsProvider>
    </KeyboardProvider>
  </UserConfigurationProvider>
);

export default BottomSheet;
