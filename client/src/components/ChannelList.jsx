import React from 'react'
import {socket} from '../socket'

class ChannelList extends React.Component {
  constructor(props) {
    super(props)
    this.newClicked = this.newClicked.bind(this)
  }

  newClicked() {
    const name = this.refs.newName.value
    if (!name) return

    console.log("emitting channel create")
    socket.emit('channel create', {name})
  }

  render() {
      return (
        <div>
          <div>Channels</div>
          <div>
            <input type="text" ref="newName" />
            <button onClick={this.newClicked}>New</button>
          </div>
        </div>
      )
  }
}

export default ChannelList
