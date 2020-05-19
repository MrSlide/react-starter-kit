'use strict'

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 50,
      lines: 45,
      statements: 45
    }
  },
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'node',
  timers: 'fake',
  verbose: true
}
