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
    .expect({status: 'failed', reason: 'Please enter both username and password.'}, done)
  })

  it('invalid handle', (done) => {
    request.post('/register')
    .send({handle: '12', password: '12345678'})
    .expect({status: 'failed', reason: 'The username must be more than 3 characters.'}, done)
  })
  
  it('invalid password', (done) => {
    request.post('/register')
    .send({handle: 'walla', password: '1234'})
    .expect({status: 'failed', reason: 'The password must be more than 7 characters.'}, done)
  })

  it('success', (done) => {
    request.post('/register')
    .send({handle: 'walla', password: '12345678'})
    .expect({status: 'success'}, done)
  })

  it('duplicate handle', (done) => {
    request.post('/register')
    .send({handle: 'walla', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/register')
      .send({handle: 'walla', password: '12345678'})
      .expect({status: 'failed', reason:'The username is already registered.'}, done)
    })
  })
})

describe('POST /login', () => {
  it('missing arguments', (done) => {
    request.post('/login')
    .send({})
    .expect({status: 'failed', reason: 'Please enter both username and password.'}, done)
  })

  it('invalid user', (done) => {
    request.post('/login')
    .send({handle: 'bob@bob.com', password: '1234'})
    .expect({status: 'failed', reason: 'The username/password is invalid.'}, done)
  })

  it('to user with bad password', (done) => {
    request.post('/register')
    .send({handle: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/login')
      .send({handle: 'bob@bob.com', password: '1234'})
      .expect({status: 'failed', reason: 'The username/password is invalid.'}, done)
    })
  })

  it('to user with good password', (done) => {
    request.post('/register')
    .send({handle: 'bob@bob.com', password: '12345678'})
    .expect({status: 'success'}, () => {
      request.post('/login')
      .send({handle: 'bob@bob.com', password: '12345678'})
      .end((error, res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        expect(res.body).to.have.property('token');
        done()
      })
    })
  })
})
