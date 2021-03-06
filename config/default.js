const { version } = require('../package.json')

module.exports = {
  _localization: {
    defaultLang: 'en',
    enabledLangs: ['en', 'en-GB']
  },
  _server: {
    maxProcesses: 1,
    port: 8080
  },
  logging: {
    level: 'warn'
  },
  routing: {
    rootPath: '/',
    mainPath: '/',
    staticPath: '/static'
  },
  version
}
