import * as React from 'react';
import withAppState from '../withAppState';
import withConnection from '../withConnection';

export interface ListManagerAppProps {
  appState: {
    list: string[];
    color?: string;
    currentItem?: string;
  };
  appActions: {
    updateCurrentItem?: (newCurrentItem: string) => void;
    addNewItem?: (newItem: string) => void;
    removeItem?: (itemToRemove: string) => void;
  };
}
export interface ListManagerState {}

type Action = (...args: any[]) => void;
type AppState = {[key: string]: any};
type AppActions = {[key: string]: Action};

export interface AppContext {
  appState: AppState;
  appActions: AppActions;
}

// <input value={currentItem} onChange={} placeholder='Add item...'/>
// <inputContainer
//   state={{value: (state) => { state.currentItem }}}
//   actions={{onChange: (actions) => { actions.updateCurrentItem }}}
//   placeholder='Add item...'
//   />

const List: React.SFC<{list: string[]}> = ({list}) => {
  return (
    <ul>
      {list.map((item => {
        return (
          <li key={item}>{item}<button> x </button></li>
        );
      }))}
    </ul>
  );
};

const ConnectedList = withConnection(List);

const ListManager: React.SFC<{}> = ({}) => {
  return (
    <div>
      <input placeholder='Add item...'/>
      <button>+</button>
      <ConnectedList/>
    </div>
  );
};

const ListManagerApp = withAppState(ListManager);


export default ListManagerApp;
