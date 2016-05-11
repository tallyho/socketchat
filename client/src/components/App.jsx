import React from 'react'
import {connect} from 'react-redux'

import Login from './Login'
import ChannelList from './ChannelList'
import ChatBox from './ChatBox'
import UserList from './UserList'

class App extends React.Component {
  render() {
    /* wait for hydration to load everything at once */
    if (!this.props.site.hydrated)
      return null

    return (
      <div>
        <div class="top">
          <div>Socket Chat 1.0</div>
          <div><Login /></div>
        </div>
        {this.props.user.token ?
        <div class="bottom">
          <ChannelList />
          <ChatBox />
          <UserList />
        </div>
        :null}
      </div>
    )
  }
}


export default connect(
  (state) => ({
    site: state.site,
    user: state.user,
  })
)(App)

