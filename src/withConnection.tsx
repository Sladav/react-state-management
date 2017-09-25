import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

interface WithConnectionProps {
  [propName: string]: any;
}

const withConnection = (WrappedComponent: React.ComponentType) => {
  class ComponentWithConnection extends React.Component<WithConnectionProps, {}> {
    displayName: string;

    static contextTypes = {
      appState: React.PropTypes.object,
      appActions: React.PropTypes.object
    };

    constructor(props: WithConnectionProps) {
      super(props);
    }

    render() {
      // pass data for cursors as props and exclude the actual cursors
      return <WrappedComponent {...this.context.appState} {...this.context.appActions}/>;
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
