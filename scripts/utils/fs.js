const fs = require('fs')
const { promisify } = require('util')
const { parse } = require('path')
const glob = require('glob')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

function find (path, pattern) {
  return new Promise(function (resolve, reject) {
    glob(pattern, {
      cwd: path,
      dot: false,
      matchBase: false,
      nocase: true,
      nonull: false,
      strict: true
    }, function (err, files) {
      if (err) {
        return reject(err)
      }

      resolve(files)
    })
  })
}

async function mkdir (path, options) {
  options = {
    recursive: true,
    ...options
  }

  return new Promise(function (resolve, reject) {
    fs.mkdir(path, options, function (err) {
      if (err && err.code !== 'EEXIST') {
        reject(err)
        return
      }

      resolve()
    })
  })
}

async function writeFile (file, data, options = {}) {
  const { dir } = parse(file)

  await mkdir(dir, { recursive: true })

  return new Promise(function (resolve, reject) {
    fs.writeFile(file, data, options, function (err) {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

module.exports = {
  find,
  mkdir,
  readdir,
  readFile,
  writeFile
}
