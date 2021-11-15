import { AppRegistry } from 'react-native';
import App from '.';

interface WebappRootTag {
  __webappRootTag?: HTMLElement;
  document: Document & any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}

type GlobalType = typeof globalThis & WebappRootTag;

const globalAny = global as GlobalType;
const rootTag = globalAny.document.getElementById('root');

const mount = (tag: HTMLElement): void => {
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
