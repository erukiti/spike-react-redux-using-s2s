require('ts-node').register()

const metaRuleHandler = require('./scripts/s2s-handler-meta-rule').default
const indexPlugin = require('./scripts/index-rule').default
const actionsPlugin = require('./scripts/actions-rule').default
const reducersPlugin = require('./scripts/reducers-rule').default

module.exports = {
  watch: './src/**/*.ts',
  plugins: [
    {
      test: /\/reducer.ts$/,
      output: '../reducers.ts',
      handler: metaRuleHandler,
      plugin: reducersPlugin,
      pluginOpts: {
        source: 'src/renderer/**/reducer.*'
      },
      babylonPlugins: ['typescript', 'classProperties']
    },
    {
      test: /\/action.ts$/,
      output: '../actions.ts',
      handler: metaRuleHandler,
      plugin: actionsPlugin,
      pluginOpts: {
        source: 'src/renderer/**/action.*'
      },
      babylonPlugins: ['typescript', 'classProperties'],
    },
    {
      test: /\/index.ts$/,
      handler: metaRuleHandler,
      plugin: indexPlugin,
      babylonPlugins: ['typescript', 'classProperties'],
    },
  ],
  prettier: false,
}