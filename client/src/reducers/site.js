import {REHYDRATE} from 'redux-persist/constants'

const INITIAL_STATE = {
  hydrated: false,
}

export function site(state = INITIAL_STATE, action) {
  switch(action.type) {
  case REHYDRATE:
    return Object.assign({}, state, {
      hydrated: true,
    })
  default:
    return state
  }
}
