import * as React from 'react';

/** Type Definitions */
interface ListData {
  items: string[];
}
interface ListActions {}
type ListProps = ListData & ListActions;

/** Presentational Component */
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

export {
  List,
  ListData,
  ListActions,
  ListProps
};
