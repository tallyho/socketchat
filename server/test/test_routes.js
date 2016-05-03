import supertest from 'supertest'
import mongoose from 'mongoose'
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
})

