import jwt from 'jsonwebtoken'
import socketioJwt from 'socketio-jwt'
import socketIo from 'socket.io'

import {jwtSecret} from './config'
import {User} from './db/user'
import {Channel} from './db/channel'

export function setupSocket(server) {
  var io = socketIo(server)

  io.use(socketioJwt.authorize({
    secret:jwtSecret,
    handshake: true
  }))

  io.on('connection', function(socket) {
    console.log('connected!')

    /* setup websocket API */
    socket.on('channel create', ({name}) => {
      Channel.findOne({name})
        .then(channel => {
          if (channel !== null)
            throw Error('The channel already exists')

          console.log('Found channel:', channel)
        }).catch((err) => {
          var message = err.message
          if(!(err instanceof Error)) {
            console.log('Error creating channel:', err)
            message = 'Internal server error. Please try again later'
          }
          socket.emit('channel create', {status: 'failed', reason: message})
        })
    })

    /* handle big bang */
    User.findOne({handle: socket.decoded_token.handle})
    .then(user => {
      for (channel in user.channels) {
        /* send all channel info user needs */
        /* subscribe user to room after sending initial dump */
        console.log(channel)
      }
    })
  })
}
