import React from 'react'
import {connect} from 'react-redux'

import Login from './Login'

class App extends React.Component {
  render() {
    return (
      <div>{this.props.site.hydrated ? <Login /> : null}</div>
  )}
}


export default connect((state) => ({ site: state.site }))(App)
