'use strict'

function getConfig (api) {
  const env = api.env()
  const isDevelopment = env !== 'production'
  const targets = api.caller(function (caller = {}) {
    const { targets } = caller

    return targets || 'current node'
  })

  return {
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      ['babel-plugin-styled-components', {
        displayName: isDevelopment,
        minify: !isDevelopment,
        pure: true,
        ssr: true,
        transpileTemplateLiterals: true
      }]
    ],
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-react',
        {
          development: isDevelopment
        }
      ],
      [
        '@babel/preset-env',
        {
          modules: env !== 'test' ? false : 'commonjs',
          targets,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ]
  }
}

module.exports = getConfig
