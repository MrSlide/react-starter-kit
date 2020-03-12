'use strict'

const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

const currentEnv = process.env.NODE_ENV = process.env.NODE_ENV || 'production'

dotenv.config({
  path: path.resolve(process.cwd(), `.${currentEnv}.env`)
})
