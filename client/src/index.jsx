import ReactDOM from 'react-dom'
import React from 'react'
import {createStore, combineReducers} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {Provider} from 'react-redux'

import {user} from './reducers/user'
import {site} from './reducers/site'
import App from './components/App'
import setupSocket from './socket'

const store = createStore(combineReducers({user, site}), undefined, autoRehydrate())
persistStore(store, {
  blacklist: ['site']
})

setupSocket(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
