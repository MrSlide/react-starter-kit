const path = require('path')

const ROOT_PATH = path.join(__dirname, '../../')
const BUILD_PATH = path.join(ROOT_PATH, 'build')
const CONFIG_PATH = path.join(ROOT_PATH, 'config')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const SRC_CLIENT_PATH = path.join(SRC_PATH, 'client')
const SRC_STATIC_PATH = path.join(SRC_CLIENT_PATH, 'static')
const STATIC_PATH = path.join(BUILD_PATH, 'static')

module.exports = {
  ROOT_PATH,
  BUILD_PATH,
  CONFIG_PATH,
  SRC_PATH,
  SRC_CLIENT_PATH,
  SRC_STATIC_PATH,
  STATIC_PATH
}
