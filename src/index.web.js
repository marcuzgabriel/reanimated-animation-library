import { AppRegistry } from 'react-native';
import App from './App.tsx';

const rootTag = global.document.getElementById('root');

const mount = tag => {
  global.__webappRootTag = tag;
  AppRegistry.registerComponent('react-native-ultimate-bottom-sheet', () => App);
  AppRegistry.runApplication('react-native-ultimate-bottom-sheet', {
    rootTag: tag,
  });
};

if (rootTag) {
  mount(rootTag);
}

export { mount };
