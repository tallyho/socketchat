export function login(handle, token) {
  return {
    type: 'LOGIN',
    handle,
    token
  }
}

export function logout() {
  return {
    type: 'LOGOUT'
  }
}

const INITIAL_STATE = {
  handle: null,
  token: null,
}

export function user(state = INITIAL_STATE, action) {
  switch(action.type) {
  case 'LOGIN':
    return Object.assign({}, state, {
      handle: action.handle,
      token: action.token
    })
  case 'LOGOUT':
    return Object.assign({}, state, {
      handle: null,
      token: null
    })
  default:
    return state
  }
}
