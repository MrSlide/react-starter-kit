const env = process.env.NODE_ENV || 'development'
const isDevelopment = env !== 'production'

module.exports = {
  env,
  isDevelopment
}
