import ReactDOM from 'react-dom'
import React from 'react'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {user} from './user'
import App from './components/App'
import {Map} from 'immutable'

const store = createStore(combineReducers({user}))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
