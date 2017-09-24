import * as React from 'react';

export interface AppProps {}
export interface AppState {}

class App extends React.Component<AppProps, AppState> {
  constructor() {
    super();
  }

  render() {
    return (
      <div>This is a start.</div>
    );
  }
}


export default App;
