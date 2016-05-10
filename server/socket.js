import jwt from 'jsonwebtoken'
import socketioJwt from 'socketio-jwt'
import socketIo from 'socketio'

import {jwtSecret} from './config'

export function setupSocket(app) {

  var io = socketIo(app)

  io.use(socketioJwt.authorize({
    secret:jwtSecret,
    handshake: true
  }))

  io.on('connect', (socket) => {
    console.log('connected!')
  })
}
