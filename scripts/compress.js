const { createReadStream, createWriteStream } = require('fs')
const path = require('path')
const zlib = require('zlib')
const { STATIC_PATH } = require('./constants/paths')
const { pipeline } = require('./utils/stream')
const { find } = require('./utils/fs')

const gzip = zlib.createGzip({
  level: 9
})
const brotli = zlib.createBrotliCompress({
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY
  }
})

async function getAssets () {
  return await find(STATIC_PATH, '**/*.{js,css,html,svg}')
}

async function compressAsset (file) {
  file = path.join(STATIC_PATH, file)

  await pipeline(
    createReadStream(file),
    gzip,
    createWriteStream(`${file}.gz`)
  )
  await pipeline(
    createReadStream(file),
    brotli,
    createWriteStream(`${file}.br`)
  )
}

async function compress () {
  const assets = await getAssets()

  await assets.forEach(compressAsset)
}

compress()
