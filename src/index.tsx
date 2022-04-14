import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NoHardRerenderingEffect from './components/Examples/NoHardRerenderingEffect';
import RNGH20 from './components/Examples/RNGH2.0';
import 'setimmediate';

const App: React.FC = () => (
  <GestureHandlerRootView>
    <RNGH20 />
  </GestureHandlerRootView>
);

export default App;
