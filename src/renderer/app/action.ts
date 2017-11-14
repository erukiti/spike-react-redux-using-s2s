import actions, {Dispatch} from '../actions'

export default class AppAction {
    dispatch: Dispatch = null

    addCount() {
        this.dispatch({type: actions.APP_ADD_COUNT})
    }
}
