// GENERATED!!
import { combineReducers } from 'redux'

import appReducer, { AppState } from './app/reducer'

export default combineReducers({
  app: appReducer
})

export interface State {
  app: AppState
}
