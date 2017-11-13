import actions from '../actions'

export default class AppAction {
    dispatch

    setDispatch(dispatch) {
        this.dispatch = dispatch
    }

    addCount() {
        this.dispatch({type: actions.APP_ADD_COUNT})
    }
}
