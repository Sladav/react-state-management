import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

type Action = (...args: any[]) => void;
type AppState = {[key: string]: any};
type AppActions = {[key: string]: Action};

export interface AppContext {
  appState: AppState;
  appActions: AppActions;
}

interface WithAppStateProps {
  appState: AppState;
  appActions: AppActions;
  [propKey: string]: any;
}

const withAppState = (AppComponent: React.ComponentType) => {
  class App extends React.Component<WithAppStateProps, {}> {
    private appState: any;
    private appActions: any;
    displayName: string;

    static childContextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithAppStateProps) {
      super(props);

      this.appState = Object.assign({}, props.appState);
      this.appActions = Object.assign({}, props.appActions);
    }

    getChildContext(): AppContext {
      return {
        appState: this.appState,
        appActions: this.appActions
      };
    }

    render() {
      return <AppComponent {...this.props}/>;
    }
  }

  // for debugging purposes, make sure component name shows what it's wrapping
  (App as React.ComponentType).displayName = `App(${getDisplayName(AppComponent)})`;

  return App;
};

function getDisplayName(AppComponent: React.ComponentType) {
  return AppComponent.displayName || AppComponent.name || 'Component';
}

export default withAppState;
