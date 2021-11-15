import React from 'react';
import ScrollViewWithSnapEffect from './components/Examples/ScrollViewWithSnapEffect';
import ScrollViewKeyboardAvoidExample from './components/Examples/ScrollViewKeyboardAvoidExample';
import IPadRotationExmaple from './components/Examples/IPadRotationExample';
import NoHardRerenderingEffect from './components/Examples/NoHardRerenderingEffect';
import 'setimmediate';

if (!global.setImmediate) {
  global.setImmediate = setTimeout as any;
}

const App: React.FC = () => <ScrollViewWithSnapEffect />;

export default App;
