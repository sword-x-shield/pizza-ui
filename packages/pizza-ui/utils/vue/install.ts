import { Component, Plugin } from 'vue';

export const withInstall = <T extends Component>(
  main: T,
) => {
  (main as T & Plugin).install = (app): void => {
    app.component(main.name!, main);
  };

  return main as T & Plugin;
};
