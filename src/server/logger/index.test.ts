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

describe('Server logger', function () {
  test('exports an instance with a server details payload', function () {
    expect(log.level).toBe(baseLog.level)
    expect(log.payload).toEqual({
      ...baseLog.payload,
      ...payload
    })
    expect(log.transport).toBe(baseLog.transport)
  })
})
