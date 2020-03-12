'use strict'

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'node',
  timers: 'fake',
  verbose: true
}
