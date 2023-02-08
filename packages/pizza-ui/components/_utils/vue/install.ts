import type { Component, Plugin } from 'vue';
import { getComponentPrefix } from '../global-config';

export const withInstall = <T extends Component>(
  main: T,
) => {
  (main as T & Plugin).install = (app): void => {
    app.component(`${getComponentPrefix()}${main.name!}`, main);
  };

  return main as T & Plugin;
};
