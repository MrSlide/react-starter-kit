const path = require('path')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminWebp = require('imagemin-webp')
const chokidar = require('chokidar')
const { createMd4Hash } = require('./utils/crypto')
const { isDevelopment } = require('./utils/env')
const { find, readFile, writeFile } = require('./utils/fs')
const { SRC_STATIC_PATH, STATIC_PATH } = require('./constants/paths')

const gifsicle = imageminGifsicle({
  interlaced: true,
  optimizationLevel: 3
})
const mozjpeg = imageminMozjpeg({
  quality: 75
})
const pngquant = imageminPngquant({
  quality: [0.5, 0.8],
  speed: 1,
  strip: true
})
const svgo = imageminSvgo()
const webp = imageminWebp({
  alphaQuality: 90,
  autoFilter: true,
  method: 6,
  quality: 75
})

async function getAssets () {
  return await find(SRC_STATIC_PATH, '**/*.{gif,jpg,png,svg}')
}

function setExtension (input, ext) {
  return input.replace(/\.[a-z0-9]+$/i, ext)
}

function setHash (input, hash) {
  return input.replace(/(?=\.[a-z0-9]+$)/i, `-${hash}`)
}

function logCompressionStats (input, output, dest) {
  const initialSize = input.length
  const compressedSize = output.length
  const compressionRatio = ((compressedSize / initialSize) * 100).toFixed(1)
  const relativePath = path.relative(STATIC_PATH, dest)

  console.info(`Saved ${relativePath} (${compressionRatio}%)`)
}

async function handleAsset (input, dest, handler) {
  const data = await readFile(input)
  const optimizedData = await handler(data)

  if (!isDevelopment) {
    const hash = createMd4Hash(data, 8)

    dest = setHash(dest, hash)
  }

  await writeFile(dest, optimizedData)

  logCompressionStats(data, optimizedData, dest)
}

async function compressAsset (file) {
  const absoltutePath = path.join(SRC_STATIC_PATH, file)
  const dest = path.join(STATIC_PATH, file)
  const { ext } = path.parse(file)

  switch (ext) {
    case '.gif':
      await handleAsset(absoltutePath, dest, gifsicle)
      break
    case '.jpg':
      await handleAsset(absoltutePath, dest, mozjpeg)
      await handleAsset(absoltutePath, setExtension(dest, '.webp'), webp)
      break
    case '.png':
      await handleAsset(absoltutePath, dest, pngquant)
      await handleAsset(absoltutePath, setExtension(dest, '.webp'), webp)
      break
    case '.svg':
      await handleAsset(absoltutePath, dest, svgo)
  }
}

async function compress () {
  const assets = await getAssets()

  await assets.forEach(compressAsset)
}

function watch () {
  const watcher = chokidar.watch('**/*.{gif,jpg,png,svg}', {
    awaitWriteFinish: {
      stabilityThreshold: 1000
    },
    cwd: SRC_STATIC_PATH
  })

  watcher.on('add', compressAsset)
  watcher.on('change', compressAsset)
}

if (process.argv.includes('--watch')) {
  watch()
} else {
  compress()
}
