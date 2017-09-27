import * as React from 'react';
import withAppState from './withAppState';
import withConnection from './withConnection';


type Action = (...args: any[]) => void;
type AppState = {[key: string]: any};
type AppActions = {[key: string]: Action};

interface AppContext {
  appState: AppState;
  appActions: AppActions;
}

interface ListData {
  items: string[];
}
interface ListActions {}
type ListProps = ListData & ListActions;

const List: React.SFC<ListProps> = ({items}) => {
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
const ConnectedList = withConnection<ListData, ListActions>(List);

interface ItemData {
  value?: string;
}
interface ItemActions {
  onUpdateItem: (newItem: string) => void;
}
type ItemProps = ItemData & ItemActions;

const ItemInput: React.SFC<ItemProps> = ({value, onUpdateItem}) => {
  return (
    <input
      placeholder='Add item...'
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateItem(event.target.value)}
    />
  );
};
const ConnectedItemInput = withConnection<ItemData, ItemActions>(ItemInput);

interface ListManagerData {
  list: string[];
  color?: string;
  currentItem?: string;
}
interface ListManagerActions {
  updateCurrentItem: (newCurrentItem: string) => void;
  addNewItem?: (newItem: string) => void;
  removeItem?: (itemToRemove: string) => void;
}
type ListManagerProps = ListManagerData & ListManagerActions;

const ListManager: React.SFC<ListManagerProps> = ({}) => {
  return (
    <div>
      <ConnectedItemInput
        appState={{}}
        appActions={{onUpdateItem: (actions: ListManagerActions) => actions.updateCurrentItem}}
      />
      <button>+</button>
      <ConnectedList
        appState={{items: (state: ListManagerData) => state.list}}
        appActions={{}}
      />
    </div>
  );
};

const ListManagerApp = withAppState<ListManagerData, ListManagerActions>(ListManager);


export {
  ListManagerApp,
  ListManagerData,
  ListManagerActions,
  ListManagerProps
};
