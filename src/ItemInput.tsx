import * as React from 'react';

/** Type Definitions */
interface ItemData {
  value?: string;
}
interface ItemActions {
  onUpdateItem: (proposedItem: string) => void;
  addNewItem: (newItem: string) => void;
}
type ItemProps = ItemData & ItemActions;

/** Presentational Component */
const ItemInput: React.SFC<ItemProps> = ({value, onUpdateItem, addNewItem}) => {
  return (
    <span>
      <input
        placeholder='Add item...'
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateItem(event.target.value)}
      />
      <button onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => addNewItem(value)}>+</button>
    </span>
  );
};

export {
  ItemInput,
  ItemData,
  ItemActions,
  ItemProps
};
