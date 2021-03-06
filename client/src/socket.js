import io from 'socket.io-client'

export var socket = null

const connectSocket = (token) => {
  socket = io.connect('http://localhost:8081', {
    query: 'token=' + token
  })

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
      connectSocket(state.user.token)
    } else if (socket !== null && state.user.token == null) {
      console.log("disconnecting socket")
      socket.disconnect()
      socket = null
    }
  })
}

