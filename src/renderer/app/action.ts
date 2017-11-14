
import actions, {Dispatch} from '../actions'

export default class AppAction {
  dispatch: Dispatch = null

  addCount(count: number) {
    this.dispatch({type: actions.APP_ADD_COUNT, count})
  }
}
