import {User} from '../db/user'
import {assert} from 'chai'

describe('User Mongoose Model', () => {
  it('valid handle bobo', (done) => {
    assert(User.validateHandle('bobo'))
    done()
  })

  it('invalid email abc', (done) => {
    assert(!User.validateHandle('abc'))
    done()
  })
})
