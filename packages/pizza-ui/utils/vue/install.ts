import { Plugin, Component } from "vue";

export const withInstall = <T extends Component, E extends Record<string, any>>(
    main: T
) => {
    ;(main as T & Plugin).install = (app): void => {
        app.component(main.name, main)
    }

    return main as T & Plugin
}
