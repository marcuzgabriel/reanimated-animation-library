import { AppRegistry } from 'react-native';
import App from '.';

const globalAny: any = global;
const rootTag = globalAny.document.getElementById('root');

const mount = (tag: any): void => {
  globalAny.__webappRootTag = tag;
  AppRegistry.registerComponent('react-native-ultimate-bottom-sheet', () => App);
  AppRegistry.runApplication('react-native-ultimate-bottom-sheet', {
    rootTag: tag,
  });
};

if (rootTag) {
  mount(rootTag);
}

export { mount };
