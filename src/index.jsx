import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';

const store = createStore((state, action) => {
  const _state = state == null ? { donate: 0, payments: [] } : state;

  switch (action.type) {
    case 'UPDATE_PAYMENTS':
      return { ..._state, payments: action.payments };
    case 'UPDATE_TOTAL_DONATE':
      return Object.assign({}, _state, {
        donate: _state.donate + action.amount,
      });

    default:
      return _state;
  }
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
