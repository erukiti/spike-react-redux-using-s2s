const globby = require('globby')

import {toUpperCamelCase} from './utils'

const re = /([^/]+)\/reducer\./

const reducersPlugin = (meta, opts) => {
  const func = (source, fileName, inputType, outputType) => {
    const names = globby.sync(opts.source).map(filepath => {
      const matched = re.exec(filepath)
      return matched[1]
    })
    return `// GENERATED!!
import { combineReducers } from 'redux'

${names.map(name => {
  return `import ${name}Reducer, { ${toUpperCamelCase(name)}State } from './${name}/reducer'`
}).join('\n')}

export default combineReducers({
${names.map(name => `  ${name}: ${name}Reducer`). join(',\n')}
})

export interface State {
${names.map(name => `  ${name}: ${toUpperCamelCase(name)}State`).join('\n')}
}
`
  }
  return {
    func
  }
}

export default reducersPlugin
