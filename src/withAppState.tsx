import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

type Action = (...args: any[]) => void;
type ActionsOnly = {[key: string]: Action};

export interface AppContext<AppData, AppActions> {
  appState: {[prop in keyof AppData]: Cursor};
  appActions: AppActions & ActionsOnly;
}

interface WithAppStateProps<AppState, AppActions> {
  appState: AppState;
  appActions: (rootCursor: any) => AppActions;
  [propKey: string]: any;
}

const withAppState = <AppData, AppActions>(AppComponent: React.ComponentType) => {
  class App extends React.Component<WithAppStateProps<AppData, AppActions>, {}> {
    private appState: AppContext<AppData, AppActions>['appState'];
    private appActions: AppContext<AppData, AppActions>['appActions'];
    private rootAppCursor: Cursor;
    static displayName: string;

    static childContextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithAppStateProps<AppData, AppActions & ActionsOnly>) {
      super(props);

      this.rootAppCursor = new Cursor(props.appState);
      (window as any).rootCursor = this.rootAppCursor;
      this.appState = Object.assign({},
        ...Object.entries(props.appState).map(([key, prop]: [keyof AppData, any]) => {
            return {[key]: this.rootAppCursor.refine([key])};
          })
      );

      this.appActions = Object.assign({}, props.appActions(this.rootAppCursor));
    }

    getChildContext(): AppContext<AppData, AppActions> {
      return {
        appState: this.appState,
        appActions: this.appActions
      };
    }

    render() {
      return <AppComponent {...Object.assign({}, this.props, {appState: undefined, appActions: undefined})}/>;
    }
  }

  // for debugging purposes, make sure component name shows what it's wrapping
  App.displayName = `App(${getDisplayName(AppComponent)})`;

  return App;
};

function getDisplayName(AppComponent: React.ComponentType) {
  return AppComponent.displayName || AppComponent.name || 'Component';
}

export {
  withAppState
};
