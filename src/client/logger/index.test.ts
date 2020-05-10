/**
 * @jest-environment jsdom
 */

import baseLog from '../../common/logger'
import log from '.'
import payload from './payload'

jest.mock('../../common/config', function () {
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

describe('Client logger', function () {
  test('exports an instance with a client details payload', function () {
    expect(log.level).toBe(baseLog.level)
    expect(log.payload).toEqual({
      ...baseLog.payload,
      ...payload
    })
    expect(log.transport).toBe(baseLog.transport)
  })
})
