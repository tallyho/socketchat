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

  console.log('test')

  io.on('connection', function(socket) {
    console.log('connected!')
    socket.emit('news', {hello:'world'});
  })
}
