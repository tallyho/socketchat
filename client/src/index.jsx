import ReactDOM from 'react-dom'
import React from 'react'
import {createStore, combineReducers} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {Provider} from 'react-redux'

import {user} from './user'
import App from './components/App'
import setupSocket from './socket'

const store = createStore(combineReducers({user}), undefined, autoRehydrate())
persistStore(store)

setupSocket(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
