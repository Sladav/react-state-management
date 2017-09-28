import * as React from 'react';
import withAppState from './withAppState';
import withConnection from './withConnection';
import { List, ListData, ListActions } from './List';
import { ItemInput, ItemData, ItemActions } from './ItemInput';

// Elevate presentational components to connected/container components
const ConnectedList = withConnection<ListData, ListActions>(List);
const ConnectedItemInput = withConnection<ItemData, ItemActions>(ItemInput);

/** Type Definitions */
interface ListManagerData {
  list: string[];
  color?: string;
  currentItem?: string;
}
interface ListManagerActions {
  updateCurrentItem: (newCurrentItem: string) => void;
  addNewItem: (newItem: string) => void;
  removeItem?: (itemToRemove: string) => void;
}
type ListManagerProps = ListManagerData & ListManagerActions;


/** Presentational Component */
const ListManager: React.SFC<ListManagerProps> = ({}) => {
  return (
    <div>
      <ConnectedItemInput
        appState={(state: ListManagerData) => ({})}
        appActions={(actions: ListManagerActions) => ({onUpdateItem: actions.updateCurrentItem, addNewItem: actions.addNewItem})}
      />
      <ConnectedList
        appState={(state: ListManagerData) => ({items: state.list})}
        appActions={(actions: ListManagerActions) => ({})}
      />
    </div>
  );
};

// Elevate presentational component to App component (one that provides appState and appActions to connected children)
const ListManagerApp = withAppState<ListManagerData, ListManagerActions>(ListManager);


export {
  ListManagerApp,
  ListManagerData,
  ListManagerActions,
  ListManagerProps
};
