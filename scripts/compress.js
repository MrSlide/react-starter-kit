const { createReadStream, createWriteStream } = require('fs')
const path = require('path')
const zlib = require('zlib')
const { STATIC_PATH } = require('./constants/paths')
const { pipeline } = require('./utils/stream')
const { find } = require('./utils/fs')

const gzipConfig = {
  level: 9
}
const brotliConfig = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY
  }
}

/**
 * Get a list of assets to compress.
 *
 * @private
 */
async function getAssets () {
  return await find(STATIC_PATH, '**/*.{js,css,html,svg}')
}

/**
 * Compress an asset with Gzip and Brotli.
 *
 * @param {string} asset - The relative path of the asset to compress.
 * @private
 */
async function compressAsset (asset) {
  const filePath = path.join(STATIC_PATH, asset)

  await pipeline(
    createReadStream(filePath),
    zlib.createGzip(gzipConfig),
    createWriteStream(`${filePath}.gz`)
  )
  await pipeline(
    createReadStream(filePath),
    zlib.createBrotliCompress(brotliConfig),
    createWriteStream(`${filePath}.br`)
  )
}

/**
 * Find and compress static assets.
 *
 * @private
 */
async function compress () {
  const assets = await getAssets()

  await assets.forEach(compressAsset)
}

compress()
