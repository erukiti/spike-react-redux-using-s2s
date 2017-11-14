const path = require('path')
const fs = require('fs')

const tsSyntax = require('@babel/plugin-syntax-typescript').default
const globby = require('globby')
const { parse } = require('babylon')

const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const babelTemplate = require('@babel/template').default

const re = /([^/]+)\/reducer\./
const reAction = /([^/]+)\/action\./

const toUpperCamelCase = s =>
  s.substr(0, 1).toUpperCase() +
  s.substr(1).replace(/-([a-z])/g, matched => matched.toUpperCase())
const toLowerCamelCase = s =>
  s.substr(0, 1).toLowerCase() +
  s.substr(1).replace(/-([a-z])/g, matched => matched.toUpperCase())

const templ = s =>
  babelTemplate(s, { sourceType: 'module', plugins: ['typescript'] })()

const WasCreated = Symbol('WasCreated')

const actionsPlugin = babel => {
  const visitor = {
    Program: {
      exit: (nodePath, state) => {
        const actions = {}
        globby.sync(state.opts.input).forEach(filepath => {
          const matched = reAction.exec(filepath)
          actions[matched[1]] = []

          const src = fs.readFileSync(filepath).toString()
          const ast = parse(src, {
            sourceType: 'module',
            plugins: ['typescript', 'classProperties']
          })
          traverse(ast, {
            ClassMethod: nodePath => {
              actions[matched[1]].push(nodePath.node.key.name)
            }
          })
        })
        console.log(actions)

        const header = templ(`import {Dispatch as ReduxDispatch} from 'redux'`)
        header.leadingComments = [{ type: 'CommentLine', value: 'GENERATED!' }]
        const bodies = [header]

      }
    }
  }
  return {
    inherits: tsSyntax,
    visitor
  }
}

const reducersPlugin = babel => {
  // const {types: t} = babel
  const visitor = {
    Program: {
      exit: (nodePath, state) => {
        const names = []

        globby.sync(state.opts.input).forEach(filepath => {
          const matched = re.exec(filepath)
          // assert(matched)
          names.push(matched[1])
        })

        const header = templ(`import { combineReducers } from 'redux'`)
        header.leadingComments = [{ type: 'CommentLine', value: 'GENERATED!' }]
        const bodies = [header]

        names.forEach(name => {
          bodies.push(
            templ(
              `import ${name}Reducer, { ${toUpperCamelCase(
                name
              )}State } from './${name}/reducer'`
            )
          )
        })

        const args = names.map(name => `${name}: ${name}Reducer`).join(', ')
        bodies.push(templ(`export default combineReducers({${args}})`))

        const args2 = names
          .map(name => `${name}: ${toUpperCamelCase(name)}State`)
          .join('\n')

        bodies.push(templ(`export interface State {\n${args2}\n}`))
        nodePath.node.body = bodies
      }
    }
  }

  return {
    inherits: tsSyntax,
    visitor
  }
}

const plugins = [
  {
    test: /reducer\.(js|ts)/,
    input: '../reducers.ts',
    output: '../reducers.ts',
    plugin: [reducersPlugin, { input: 'src/renderer/**/reducer.ts' }]
  },
  {
    test: /action\.(js|ts)/,
    input: '../actions.ts',
    output: '../actions.ts',
    plugin: [actionsPlugin, { input: 'src/renderer/**/action.ts' }]
  }
]

module.exports = {
  watch: 'src/**/*.(js|ts)',
  plugins
}
