import config from '../../config'

export default {
  env: process.env.NODE_ENV,
  version: config('version')
}
