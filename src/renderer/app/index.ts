import {connect} from 'react-redux'

import AppComponent from './component'
import AppAction from './action'
import {State} from '../reducers'
import {ActionType} from '../actions'

interface AppActionProps{
    addCount: () => void
}

export type AppProps = State | AppActionProps


const mapStateToProps = (state: State) => {
    return state
}

const mapDispatchToProps = (dispatch) => ({dispatch})

const action = new AppAction()

const mergeProps = (stateProps, {dispatch}, ownProps) => {
    action.dispatch = dispatch

    return {
        ...stateProps,
        ...ownProps,
        addCount: action.addCount.bind(action),
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppComponent)
