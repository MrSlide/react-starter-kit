import log, { LogLevel } from '.'
import { pretty } from './formatters'
import { Console } from './transports'
import payload from './payload'
import { LogLevel as OriginalLogLevel } from './types'

jest.mock('../config', function () {
  return {
    __esModule: true,
    default: function (key) {
      switch (key) {
        case 'logging.level':
          return 'warn'
      }
    }
  }
})

describe('Common logger', function () {
  test('exports the log levels constants', function () {
    expect(LogLevel).toBe(OriginalLogLevel)
  })

  test('exports an instance with base options', function () {
    expect(log.level).toBe('warn')
    expect(log.payload).toBe(payload)
    expect(log.transport instanceof Console).toBe(true)
    expect(log.transport.formatter).toBe(pretty)
  })
})
