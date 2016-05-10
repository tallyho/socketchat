import {User} from '../db'
import {assert} from 'chai'

describe('User Mongoose Model', () => {
  it('valid email bob@bob.com', (done) => {
    assert(User.validateEmail('bob@bob.com'))
    done()
  })

  it('valid email bob123@bob.com', (done) => {
    assert(User.validateEmail('bob123@bob.com'))
    done()
  })
})
