
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

const INITIAL_STATE = {
  'email': null,
  'token': null,
}

export function user(state = INITIAL_STATE, action) {
  switch(action.type) {
  case 'LOGIN':
    return Object.assign({}, state, {
      'email': action.email,
      'token': action.token
    })
  case 'LOGOUT':
    return Object.assign({}, state, {
      'email': null,
      'token': null
    })
  default:
    return state
  }
}
