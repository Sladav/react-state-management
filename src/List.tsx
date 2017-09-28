import * as React from 'react';

/** Type Definitions */
interface ListData {
  items: string[];
}
interface ListActions {
  removeItem: (removedItem: string) => void;
}
type ListProps = ListData & ListActions;

/** Presentational Component */
const List: React.SFC<ListProps> = ({items, removeItem}) => {
  return (
    <ul>
      {items.map((item => {
        return (
          <li key={item}>{item}<button onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => removeItem(item)}> x </button></li>
        );
      }))}
    </ul>
  );
};

export {
  List,
  ListData,
  ListActions,
  ListProps
};
