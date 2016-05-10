import express from 'express'
import bodyParser from 'body-parser'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'

import {jwtSecret} from './config'
import {User} from './db'


const app = express()
app.use(bodyParser.json())

// allow client to request stuff
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
 });

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.json({status:'failed', reason: 'missing arguments'})
    return
  }

  User.findOne({email})
    .then((user) => {
      if (user === null) {
        return Promise.reject('invalid user')
      }

      const passwordHash = User.makePasswordHash(password, user.passwordSalt)
      if (passwordHash != user.passwordHash) {
        return Promise.reject('invalid password')
      }

      const token = jwt.sign(user, 'abc123')
      res.json({status: 'success', token})
    }).catch((error) => {
      res.json({status: 'failed', reason: error})
    })
})

app.post('/register', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.json({status:'failed', reason: 'missing arguments'})
    return
  }

  if (!User.validateEmail(email)) {
    res.json({status:'failed', reason: 'invalid email'})
    return
  } else if (!User.validatePassword(password)) {
    res.json({status:'failed', reason: 'invalid password'})
    return
  }

  User.findOne({email})
    .then((obj) => {
      if (obj !== null) {
        return Promise.reject('duplicate email')
      }

      const passwordSalt = User.makePasswordSalt()
      const passwordHash = User.makePasswordHash(password, passwordSalt);

      return User.create({email, passwordSalt, passwordHash})
    })
    .then((user) => {
      res.json({status:'success'})
    })
    .catch((error) => {
      res.json({status:'failed', reason: error})
    })
})

export default app
