const crypto = require('crypto')

function createMd4Hash (data, length) {
  const hash = crypto.createHash('md4')

  hash.update(data)

  return hash.digest('hex').substring(0, length)
}

module.exports = {
  createMd4Hash
}
