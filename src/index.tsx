import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';

(Error as any).stackTraceLimit = Infinity;

const shoppingList: string[] = ['apples', 'bananas', 'cherries'];

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
