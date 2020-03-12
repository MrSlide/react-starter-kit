const stream = require('stream')
const util = require('util')

const pipeline = util.promisify(stream.pipeline)

module.exports = {
  pipeline
}
