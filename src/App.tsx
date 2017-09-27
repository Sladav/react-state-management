import * as React from 'react';
import { ListManagerApp, ListManagerData } from './ListManagerApp';


class App extends React.Component<{}, ListManagerData> {
  constructor() {
    super();

    this.updateCurrentItem = this.updateCurrentItem.bind(this);

    this.state = {
      list: ['apples', 'bananas', 'cherries'],
      currentItem: ''
    };
  }

  updateCurrentItem = (newCurrentItem: string) => {
    this.setState({currentItem: newCurrentItem});
  };

  render() {
    const {list, currentItem} = this.state;
    const {updateCurrentItem} = this;

    console.log(currentItem);

    return (
      <div>
        <button>toggle color</button>
        <br/>
        <br/>
        <ListManagerApp appState={{list}} appActions={{updateCurrentItem}}/>
      </div>
    );
  }
}


export default App;
