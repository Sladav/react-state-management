import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';

(Error as any).stackTraceLimit = Infinity;

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
