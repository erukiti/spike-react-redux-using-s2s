
import actions, {ActionType} from '../actions'

const initialState = {
  count: 0
}

export type AppState = typeof initialState

export default function appReducer(state: AppState = initialState, action: ActionType) {
  switch (action.type) {
    case actions.APP_ADD_COUNT: {
      return {count: state.count + action.count}
    }
    default: return state
  }
}
