import ReactDOM from 'react-dom'
import React from 'react'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {Map} from 'immutable'

import {user} from './user'
import App from './components/App'
import setupSocket from './socket'

const store = createStore(combineReducers({user}))

setupSocket(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
