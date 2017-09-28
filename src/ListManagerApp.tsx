import * as React from 'react';
import { withAppState } from './withAppState';
import { withConnection } from './withConnection';
import { List, ListData, ListActions } from './List';
import { ItemInput, ItemData, ItemActions } from './ItemInput';

// Elevate presentational components to connected/container components
const ConnectedList = withConnection<ListData, ListActions>(List);
const ConnectedItemInput = withConnection<ItemData, ItemActions>(ItemInput);

/** Type Definitions */
interface ListManagerData {
  list: string[];
  color?: string;
  currentItem: string;
}
interface ListManagerActions {
  updateCurrentItem: (newCurrentItem: string) => void;
  addNewItem: (newItem: string) => void;
  removeItem: (itemToRemove: string) => void;
}
type ListManagerProps = ListManagerData & ListManagerActions;

// not sure about this yet
interface ListManagerApiProps {}

/** Presentational Component */
// TODO: BETTER NAMES!! appState -> mapPropsToState (or something like that)
const ListManager: React.SFC<ListManagerProps> = ({}) => {
  return (
    <div style={{border: '1px solid cornflowerblue', margin: '15px', padding: '5px'}}>
      <ConnectedItemInput
        appState={(state: ListManagerData) => ({value: state.currentItem})}
        appActions={(actions: ListManagerActions) => ({onUpdateItem: actions.updateCurrentItem, addNewItem: actions.addNewItem})}
      />
      <ConnectedList
        appState={(state: ListManagerData) => ({items: state.list})}
        appActions={(actions: ListManagerActions) => ({removeItem: actions.removeItem})}
      />
    </div>
  );
};

/** Define Initial State */
const ListManagerDefaultState: ListManagerData = {
  list: ['apples', 'bananas', 'cherries'],
  currentItem: ''
};



/** Define Actions */
/**
 * FIXME: Things I don't like...
 *  - dependency injecting root cursors here but you end up just guessing at
 *    cursor paths; ex.. is currentItem right??
 *  - the dependency is injected inside withAppState which is FAR from obvious;
 */
const ListManagerActions = (rootCursor: any): ListManagerActions => {
  return {
    updateCurrentItem: (newCurrentItem: string) => {
      const currentItem = rootCursor.refine(['currentItem']);

      currentItem.data = newCurrentItem;
    },
    addNewItem: (newItem: string) => {
      const list = rootCursor.refine(['list']);

      list.data = [...list.data, newItem];
    },
    removeItem: (itemToRemove: string) => {
      const list = rootCursor.refine(['list']);

      list.data = list.data.filter((item: string) => item !== itemToRemove);
    }
  };
};

// Elevate presentational component to App component (one that provides appState and appActions to connected children)
const ListManagerAppContainer = withAppState<ListManagerData, ListManagerActions>(ListManager);


/**
 * TODO:
 *  - This currently only exists to map appstate and appActions
 *  - In the future, this is where extra API type stuff would go
 *
 *  IDEA: API interfaces...
 *  - (1) via props
 *  - (2) put bound actions on instance, so external calls can call to modify internal state
 */
class ListManagerApp extends React.Component<ListManagerApiProps> {
  constructor(props: ListManagerApiProps) {
    super(props);
  }

  render() {
    return (
      <ListManagerAppContainer
        appState={ListManagerDefaultState}
        appActions={ListManagerActions}
      />
    );
  }
}

export {
  ListManagerApp,
  ListManagerData,
  ListManagerActions,
  ListManagerProps
};
