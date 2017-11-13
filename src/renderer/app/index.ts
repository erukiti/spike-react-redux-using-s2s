import {connect} from 'react-redux'

import AppComponent from './component'
import AppAction from './action'

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => ({dispatch})

const action = new AppAction()

const mergeProps = (stateProps, {dispatch}, ownProps) => {
    action.setDispatch(dispatch)

    return {
        ...stateProps,
        ...ownProps,
        addCount: action.addCount.bind(action),
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppComponent)