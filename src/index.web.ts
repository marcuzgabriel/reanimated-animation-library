import { AppRegistry } from 'react-native';
import App from '.';

const rootTag = global.document.getElementById('root');

interface WebappRootTag {
  __webappRootTag?: typeof rootTag;
  document: typeof global.document;
}

const globalAny: WebappRootTag = global;

const mount = (tag: typeof rootTag): void => {
  globalAny.__webappRootTag = tag;
  AppRegistry.registerComponent('reanimated-animation-library', () => App);
  AppRegistry.runApplication('reanimated-animation-library', {
    rootTag: tag,
  });
};

if (rootTag) {
  mount(rootTag);
}

export { mount };
