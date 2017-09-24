import * as React from 'react';

export interface ListManagerProps {
  list: string[];
}
export interface ListManagerState {}

class ListManager extends React.Component<ListManagerProps, ListManagerState> {
  constructor() {
    super();
  }

  render() {
    const {list} = this.props;

    return (
      <div>
        <input placeholder='Add item...'/>
        <button>+</button>
        <ul>
          {list.map((item => {
            return (
              <li key={item}>{item}<button> x </button></li>
            );
          }))}
        </ul>
      </div>
    );
  }
}


export default ListManager;
