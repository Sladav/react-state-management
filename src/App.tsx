import * as React from 'react';
import ListManagerApp from './ListManagerApp';

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
        <ListManagerApp appState={{list: list}} appActions={{}}/>
      </div>
    );
  }
}


export default App;
