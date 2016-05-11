import io from 'socket.io-client'

var socket = null

const connectSocket = () => {
  socket = io.connect('http://localhost:8081')

  const states = [
    'connect',
    'connect_error',
    'connect_timeout',
    'reconnect',
    'reconnecting',
    'reconnect_error',
    'reconnect_failed'
  ]
  for (let state of states) {
    socket.on(state, () => {
      console.log('socket:', socket.connected)
    })
  }

  socket.on('news', (data) => {
    console.log("news!", data)
  })
}

export default (store) => {
  store.subscribe(() => {
    const state = store.getState()
    console.log("state:", state)
    if (socket === null && state.user.token != null) {
      console.log("connecting socket")
      connectSocket()
    } else if (socket !== null && state.user.token == null) {
      console.log("disconnecting socket")
      socket.disconnect()
      socket = null
    }
  })
}

