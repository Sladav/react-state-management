import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

interface WithConnectionProps<ComponentState, ComponentActions> {
  appState: {[prop in keyof ComponentState]: (state: {[key: string]: any}) => ComponentState[prop]};
  appActions: ComponentActions;
  [propName: string]: any;
}

const withConnection = <T, U>(WrappedComponent: React.ComponentType) => {
  class ComponentWithConnection extends React.Component<WithConnectionProps<T, U>, {}> {
    displayName: string;

    static contextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithConnectionProps<T, U>) {
      super(props);
    }

    render() {
      const appState = Object.assign({}, ...Object.entries(this.props.appState).map(([key, getter]: [string, any]) => {
        return {[key]: getter(this.context.appState)};
      }));

      // pass data for cursors as props and exclude the actual cursors
      return <WrappedComponent {...appState} {...this.context.appActions}/>;
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
