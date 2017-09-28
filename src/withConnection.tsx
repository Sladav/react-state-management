import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

interface WithConnectionProps<ComponentState, ComponentActions> {
  appState: (state: {[key: string]: any}) => {[prop in keyof ComponentState]: ComponentState[prop]};
  appActions: (actions: {[key: string]: any}) => {[prop in keyof ComponentActions]: ComponentActions[prop]};
  [propName: string]: any;
}

const withConnection = <ComponentState, ComponentActions>(WrappedComponent: React.ComponentType) => {
  class ComponentWithConnection extends React.Component<WithConnectionProps<ComponentState, ComponentActions>, {}> {
    private cursors: {};
    private changeListeners: {[key: string]: (...args: any[]) => any} = {};
    private appActions: {};
    static displayName: string;

    static contextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithConnectionProps<ComponentState, ComponentActions>, context: any) {
      super(props);

      // use the mapStateToProps function (on props.AppState) to connect props to cursors in root app state
      this.cursors = props.appState(context.appState);
      this.appActions = props.appActions(context.appActions);
    }

    componentWillMount() {
      Object.entries(this.cursors).map(([key, cursor]: [string, Cursor]) => {
        // Create change listener unique to current cursor
        const changeListener = (rootNextData: any) => {
          this.setState({
            [key]: cursor.path.reduce(
              (data: any, path: string) => data[path], rootNextData
            )
          });
        };

        this.changeListeners[key] = changeListener;
        cursor.onChange(changeListener);

        // set initial state for each cursor
        this.setState({[key]: cursor.data});
      });
    }

    componentWillUnmount() {
      Object.entries(this.cursors).map(([key, cursor]: [string, Cursor]) => {
        cursor.removeListener(this.changeListeners[key]);
        delete this.changeListeners[key];
      });
    }

    render() {
      // pass data for cursors as props
      //  - exclude appState, appActions maps
      const props = Object.assign(
        {},
        this.props,
        {appState: undefined, appActions: undefined},
        this.state,
        this.appActions
      );

      return (
        <WrappedComponent
          {...props}
        />
      );
    }
  }

  // for debugging purposes, make sure component name shows what it's wrapping
  ComponentWithConnection.displayName = `withConnection(${getDisplayName(WrappedComponent)})`;

  return ComponentWithConnection;
};

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export {
  withConnection
};
