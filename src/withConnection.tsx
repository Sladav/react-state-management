import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

interface WithConnectionProps<ComponentState, ComponentActions> {
  appState: (state: {[key: string]: any}) => {[prop in keyof ComponentState]: ComponentState[prop]};
  appActions: (actions: {[key: string]: any}) => {[prop in keyof ComponentActions]: ComponentActions[prop]};
  [propName: string]: any;
}

const withConnection = <ComponentState, ComponentActions>(WrappedComponent: React.ComponentType) => {
  class ComponentWithConnection extends React.Component<WithConnectionProps<ComponentState, ComponentActions>, {}> {
    displayName: string;

    static contextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithConnectionProps<ComponentState, ComponentActions>) {
      super(props);
    }

    render() {
      const appState = this.props.appState(this.context.appState);
      const appActions = this.props.appActions(this.context.appActions);

      // pass data for cursors as props and exclude the actual cursors
      return <WrappedComponent {...appState} {...appActions}/>;
    }
  }

  // for debugging purposes, make sure component name shows what it's wrapping
  (ComponentWithConnection as React.ComponentType).displayName = `withConnection(${getDisplayName(WrappedComponent)})`;

  return ComponentWithConnection;
};

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withConnection;
