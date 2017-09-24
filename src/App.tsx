import * as React from 'react';
import ListManager from './ListManager';

export interface AppProps {
  list: string[];
}
export interface AppState {}

class App extends React.Component<AppProps, AppState> {
  constructor() {
    super();
  }

  render() {
    const {list} = this.props;

    return (
      <div>
        <button>toggle color</button>
        <br/>
        <br/>
        <ListManager list={list}/>
      </div>
    );
  }
}


export default App;
