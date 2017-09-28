import * as React from 'react';
import { ListManagerApp, ListManagerData } from './ListManagerApp';


class App extends React.Component<{}, ListManagerData> {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <button>toggle color</button>
        <br/>
        <br/>
        <ListManagerApp/>
        <ListManagerApp/>
        <ListManagerApp/>
      </div>
    );
  }
}


export default App;
