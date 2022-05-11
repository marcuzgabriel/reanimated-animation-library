import React from 'react';
import NoHardRerenderingEffect from './components/Examples/NoHardRerenderingEffect';
import Toggle from './components/Toggle';
import 'setimmediate';

const App: React.FC = () => <Toggle />;

export default App;
