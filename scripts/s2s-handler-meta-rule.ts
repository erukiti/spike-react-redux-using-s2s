const fs = require('fs')
const path = require('path')

const { parse } = require('babylon')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default

const metaRuleHandler = (code, { eventPath, plugin: opts, filename }) => {
  // FIXME: cache

  const babylonPlugins = opts.babylonPlugins || []
  if (babylonPlugins.length === 0 && filename.substr(-3) === '.ts') {
    babylonPlugins.push('typescript')
  }

  const getNode = filename => {
    return parse(fs.readFileSync(filename).toString(), {
      sourceType: 'module',
      plugins: babylonPlugins
    })
  }

  const getNodePath = filename => {
    const ast = getNode(filename)
    let result
    traverse(ast, {
      visitor: {
        Program: {
          exit: nodePath => {
            result = nodePath
          },
        },
      },
    })
    return result
  }

  const meta = {
    getNode,
    getNodePath,
    getTemplate: filename => {
      return fs.readFileSync(path.join(process.cwd(), 'templates', filename))
    },
    traverse,
    types,
    opts,
  }

  const plugin = opts.plugin(meta, opts.pluginOpts)
  return plugin.func(code, filename, '.js', '.js')
}

export default metaRuleHandler
