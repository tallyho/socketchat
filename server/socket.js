import jwt from 'jsonwebtoken'
import socketioJwt from 'socketio-jwt'
import socketIo from 'socket.io'

import {jwtSecret} from './config'

export function setupSocket(server) {

  var io = socketIo(server)

  io.use(socketioJwt.authorize({
    secret:jwtSecret,
    handshake: true
  }))

  io.on('connection', (socket) => {
    console.log('connected!')
    socket.emit('news', {hello:'world'});
  })
}
