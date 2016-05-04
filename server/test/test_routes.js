import supertest from 'supertest'
import mongoose from 'mongoose'
import {expect} from 'chai'

import app from '../routes'

const request = supertest(app)

beforeEach((done) => {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    mongoose.models = {};
    mongoose.modelSchemas = {};
    return done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost/test', (err) => {
      if (err)
        throw err;
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterEach((done) => {
  mongoose.disconnect();
  return done();
});

describe('POST /register', () => {
  it('missing arguments', (done) => {
    request.post('/register')
    .send({})
    .expect({status: 'failed', reason: 'missing arguments'}, done)
  })

  it('invalid email', (done) => {
    request.post('/register')
    .send({email: '123123', password: '12345678'})
    .expect({status: 'failed', reason: 'invalid email'}, done)
  })
  
  it('invalid password', (done) => {
    request.post('/register')
    .send({email: 'bob@bob.com', password: '1234'})
    .expect({status: 'failed', reason: 'invalid password'}, done)
  })

  it('success', (done) => {
    request.post('/register')
    .send({email: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, done)
  })

  it('duplicate email', (done) => {
    request.post('/register')
    .send({email: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/register')
      .send({email: 'bob@bob.com', password: '12345678'})
      .expect({status: 'failed', reason:'duplicate email'}, done)
    })
  })
})

describe('POST /login', () => {
  it('missing arguments', (done) => {
    request.post('/login')
    .send({})
    .expect({status: 'failed', reason: 'missing arguments'}, done)
  })

  it('invalid user', (done) => {
    request.post('/login')
    .send({email: 'bob@bob.com', password: '1234'})
    .expect({status: 'failed', reason: 'invalid user'}, done)
  })

  it('to user with bad password', (done) => {
    request.post('/register')
    .send({email: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/login')
      .send({email: 'bob@bob.com', password: '1234'})
      .expect({status: 'failed', reason: 'invalid password'}, done)
    })
  })

  it('to user with good password', (done) => {
    request.post('/register')
    .send({email: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/login')
      .send({email: 'bob@bob.com', password: '12345678'})
      .end((error, res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        expect(res.body).to.have.property('token');
        done()
      })
    })
  })
})
