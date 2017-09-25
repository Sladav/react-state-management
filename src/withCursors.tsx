import * as React from 'react';
import Cursor from './util/seamless-immutable-cursor';

interface WithCursorProps {
  cursors: {[key: string]: Cursor};
  [propName: string]: any;
}

const withCursors = (WrappedComponent: React.ComponentType) => {
  class ComponentWithCursors extends React.Component<WithCursorProps, {}> {
    private cursors: {};
    private changeListeners: {[key: string]: (...args: any[]) => any} = {};
    displayName: string;

    constructor(props: WithCursorProps) {
      super(props);

      this.cursors = props.cursors;
    }

    componentWillMount() {
      Object.entries(this.cursors).map(([key, cursor]: [string, Cursor]) => {
        // Create change listener unique to current cursor
        const changeListener = (rootNextData: any) => {
          this.setState({[key]: cursor.path.reduce((data: any, path: string) => data[path], rootNextData)});
        };

        this.changeListeners[key] = changeListener;

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
      // pass data for cursors as props and exclude the actual cursors
      return <WrappedComponent {...Object.assign({}, this.props, {cursors: undefined})} {...this.state}/>;
    }
  }

  // for debugging purposes, make sure component name shows what it's wrapping
  (ComponentWithCursors as React.ComponentType).displayName = `withCursors(${getDisplayName(WrappedComponent)})`;

  return ComponentWithCursors;
};

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withCursors;
