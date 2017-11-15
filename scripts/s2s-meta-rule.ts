const metaRuleHandler = require('./s2s-handler-meta-rule').default

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

export const createPluginsFromMetaRules = (rule, opts) => {
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

