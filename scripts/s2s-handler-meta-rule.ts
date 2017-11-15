const fs = require('fs')
const path = require('path')

const { parse } = require('babylon')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const template = require('@babel/template')
const prettier = require('prettier')
const babelGenerate = require('@babel/generator')

const metaRuleHandler = (code, { eventPath, plugin: opts, filename }) => {
  // FIXME: cache

  const generatorType = opts.generator || 'prettier'

  const generators = {
    prettier: (ast) => {
      prettier.format('dummy', {
        parser(text) {
          return ast
        }
      })
    },
    babel: (ast) => babelGenerate(ast)
  }
  const generate = generators[generatorType]

  const babylonPlugins = opts.babylonPlugins || []
  if (babylonPlugins.length === 0 && filename.substr(-3) === '.ts') {
    babylonPlugins.push('typescript')
  }
  const babylonOpts = {
    sourceType: 'module',
    plugins: babylonPlugins
  }

  const getNode = filename => {
    return parse(fs.readFileSync(filename).toString(), babylonOpts)
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
    template: s => template(s, babylonOpts),
    traverse,
    types,
    opts,
  }

  const sourceTypes = {
    BabelNodePath: () => getNodePath(filename),
    '.ts': () => code,
    undefined: () => null,
  }

  // FIXME 多段プラグインの仕組み
  // FIXME cache への反映

  const outputTypes = ['BabelNodePath', 'BabelNode', '.ts']

  const plugin = opts.plugin(meta, opts.pluginOpts)
  const inputType = plugin.inputTypes.find(inputType => inputType in sourceTypes)
  const outputType = outputTypes.find(outputType => plugin.outputTypes.indexOf(outputType) !== -1)
  const output = plugin.func(sourceTypes[inputType](), filename, inputType, outputType)
  switch (outputType) {
    case '.ts': {
      return output
    }

    case 'BabelNode': {
      return generate(output)
    }

    case 'BabelNodePath': {
      return generate(output.node)
    }
  }
  throw new Error(`unknown outputType ${outputType}`)
}

export default metaRuleHandler
