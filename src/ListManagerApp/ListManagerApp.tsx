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

const List: React.SFC<{items: string[]}> = ({items}) => {
  return (
    <ul>
      {items.map((item => {
        return (
          <li key={item}>{item}<button> x </button></li>
        );
      }))}
    </ul>
  );
};

const ConnectedList = withConnection<{items: string[]}, {[key: string]: any}>(List);

const ListManager: React.SFC<{}> = ({}) => {
  return (
    <div>
      <input placeholder='Add item...'/>
      <button>+</button>
      <ConnectedList
        appState={{items: (state: ListManagerAppProps['appState']) => state.list}}
        appActions={{}}
      />
    </div>
  );
};

const ListManagerApp = withAppState(ListManager);


export default ListManagerApp;
