'use strict'

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:jest/recommended',
    'standard-with-typescript',
    'standard-react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  ignorePatterns: ['build/', 'coverage/', 'node_modules/'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    resolveJsonModule: true
  },
  plugins: [
    'jest',
    'react',
    '@typescript-eslint'
  ],
  root: true
}
