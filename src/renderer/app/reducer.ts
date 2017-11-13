import actions from '../actions'

const initialState = {
    count: 0
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case actions.APP_ADD_COUNT: {
            return {count: state.count + 1}
        }
        default: return state
    }
}
