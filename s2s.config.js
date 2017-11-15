require('ts-node').register()

const metaRuleHandler = require('./scripts/s2s-handler-meta-rule').default
const indexPlugin = require('./scripts/index-rule').default
const actionsPlugin = require('./scripts/actions-rule').default
const reducersPlugin = require('./scripts/reducers-rule').default

const metaOpts = {
  babylonPlugins: ['typescript', 'classProperties']
}

const metaRule = {
  'src/renderer/**/reducer.*': {
    output: '../reducers.ts',
    plugin: reducersPlugin,
  },
  'src/renderer/**/action.*': {
    output: '../actions.ts',
    plugin: actionsPlugin,
  },
  'src/renderer/**/index.ts': {
    plugin: indexPlugin,
  },
}

const globToRegexp = pattern => {
  const asteriskPattern = {
    '*': '[^/]*',
    '**': '.*'
  }

  return new RegExp(pattern
    .replace('.', '\.')
    .replace(/\*\*?/g, matched => asteriskPattern[matched])
  )
}

const createPluginsFromMetaRules = (rule, opts) => {
  const plugins = Object.keys(rule).map(key => {
    const {output, plugin} = rule[key]
    return {
      test: globToRegexp(key),
      output,
      handler: metaRuleHandler,
      plugin,
      pluginOpts: {
        source: key
      },
      babylonPlugins: opts.babylonPlugins
    }
  })

  return plugins
}

const plugins = createPluginsFromMetaRules(metaRule, metaOpts)

module.exports = {
  watch: './**/*',
  plugins,
  prettier: false,
}