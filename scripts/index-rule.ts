import * as path from 'path'
import { toUpperCamelCase, createFileSync } from './utils'

const indexPlugin = (meta, opts) => {
  const func = (source, fileName, inputType, outputType) => {
    if (source && source !== '') {
      return source
    }

    const arr = path.dirname(fileName).split(path.sep)
    const name = arr[arr.length - 1]
    const upperName = toUpperCamelCase(name)

    const reducerSource = 
`import actions, { ActionType } from '../actions'

const initialState = {
}

export type ${upperName}State = typeof initialState

export default function appReducer(state: ${upperName}State = initialState, action: ActionType) {
  switch (action.type) {
    default: return state
  }
}
`

    const actionSource = 
`
import actions, {Dispatch} from '../actions'

export default class ${upperName}Action {
  dispatch: Dispatch = null

}
`

    const componentSource = 
`
import * as React from 'react'
import {${upperName}Props} from './index'

export default class ${upperName}Component extends React.Component<${upperName}Props> {
  render() {
    return <div>
    </div>
  }
}
`

    const indexSource = 
`
import {connect} from 'react-redux'

import ${upperName}Component from './component'
import ${upperName}Action from './action'
import {State} from '../reducers'
import {ActionType, Dispatch} from '../actions'


const mapStateToProps = (state: State) => {
    return state
}

const mapDispatchToProps = (dispatch: Dispatch) => ({dispatch})

export type ${upperName}Props = State & ${upperName}Action

const action = new ${upperName}Action()

const mergeProps = (stateProps, {dispatch}, ownProps) => {
  action.dispatch = dispatch

  const res = {...stateProps, ...ownProps}
  
  Object.keys(Object.getPrototypeOf(action)).forEach(name => {
      res[name] = action[name].bind(action)
  })
  return res
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(${upperName}Component)
`

    createFileSync(path.join(path.dirname(fileName), 'reducer.ts'), reducerSource)
    createFileSync(path.join(path.dirname(fileName), 'action.ts'), actionSource)
    createFileSync(path.join(path.dirname(fileName), 'component.tsx'), componentSource)
    return indexSource
  }

  return {
    name: 'index',
    func,
    inputTypes: ['.ts'],
    outputTypes: ['.ts'],
  }
}

export default indexPlugin
