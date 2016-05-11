import express from 'express'
import bodyParser from 'body-parser'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'

import {jwtSecret} from './config'
import {User} from './db/user'

const app = express()
app.use(bodyParser.json())

// allow client to request stuff
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
 });

app.post('/login', (req, res) => {
  const {handle, password} = req.body;
  if (!handle || !password) {
    res.json({status:'failed', reason: 'Please enter both username and password.'})
    return
  }

  User.findOne({handle})
    .then((user) => {
      if (user === null)
        throw Error('The username/password is invalid.')

      const passwordHash = User.makePasswordHash(password, user.passwordSalt)
      if (passwordHash != user.passwordHash)
        throw Error('The username/password is invalid.')

      const token = jwt.sign(user, jwtSecret)
      res.json({status: 'success', token})
    }).catch((error) => {
      var message = error.message
      if (!(error instanceof Error))
        message = 'Internal server error. Try again later.'
      res.json({status: 'failed', reason: message})
    })
})

app.post('/register', (req, res) => {
  const {handle, password} = req.body;
  if (!handle || !password) {
    res.json({status:'failed', reason: 'Please enter both username and password.'})
    return
  }

  if (!User.validateHandle(handle)) {
    res.json({status:'failed', reason: 'The username must be more than 3 characters.'})
    return
  } else if (!User.validatePassword(password)) {
    res.json({status:'failed', reason: 'The password must be more than 7 characters.'})
    return
  }

  User.findOne({handle})
    .then((obj) => {
      if (obj !== null)
        throw Error('The username is already registered.')

      const passwordSalt = User.makePasswordSalt()
      const passwordHash = User.makePasswordHash(password, passwordSalt);

      return User.create({handle, passwordSalt, passwordHash})
    })
    .then((user) => {
      res.json({status:'success'})
    })
    .catch((error) => {
      var message = error.message
      if (!(error instanceof Error))
        message = 'Internal server error. Try again later.'
      res.json({status:'failed', reason: message})
    })
})

export default app
