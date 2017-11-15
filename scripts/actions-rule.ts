const globby = require('globby')

import {toUpperSnakeCase} from './utils'

const reAction = /([^/]+)\/action\./

const actionsPlugin = (meta, opts) => {
  const func = (source, fileName, inputType, outputType) => {
    const actions = {}
    globby.sync(opts.source).forEach(filepath => {
      const matched = reAction.exec(filepath)

      const ast = meta.getNode(filepath)
      meta.traverse(ast, {
        ClassMethod: nodePath => {
          if (nodePath.node.key.name.substr(0, 1) === '_') {
            return
          }
          // assert(nodePath.node.params.type === 'Identifier)
          const args = nodePath.node.params.map(param => {
            if (!param.typeAnnotation || !param.typeAnnotation.typeAnnotation) {
              return '${param.name}: any'
            }
            switch (param.typeAnnotation.typeAnnotation.type) {
              case 'TSNumberKeyword': {
                return `${param.name}: number`
              }
              case 'TSStringKeyword': {
                return `${param.name}: string`
              }
            }
          })
          actions[toUpperSnakeCase(`${matched[1]}_${nodePath.node.key.name}`)] = args
        }
      })
    })
    
    const actionTypes = Object.keys(actions).map(key => {
      return `  { type: '${key}', ${actions[key].join(', ')} }`
    }).join(' &\n')

    const actions2 = Object.keys(actions).map(key => `  ${key}: '${key}'`).join(',\n')

    return `// GENERATED!!
import { Dispatch as ReduxDispatch } from 'redux'

export type ActionType =
${actionTypes}

export type Dispatch = ReduxDispatch<ActionType>
const actions = {
${actions2}
}
export default actions
`
  }

  return {
    name: 'actions',
    func,
    inputTypes: [],
    outputTypes: ['.ts'],
  }
}

export default actionsPlugin
