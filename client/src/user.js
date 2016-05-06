import {Map} from 'immutable'

export function login(email, token) {
  return {
    type: 'LOGIN',
    email,
    token
  }
}

export function logout() {
  return {
    type: 'LOGOUT'
  }
}

const INITIAL_STATE = Map({
  'email': null,
  'token': null,
})

export function user(state = INITIAL_STATE, action) {
  switch(action.type) {
  case 'LOGIN':
    return state.merge({
      'email': action.email,
      'token': action.token
    })
  case 'LOGOUT':
    return state.merge({
      'email': null,
      'token': null
    })
  default:
    return state
  }
}
