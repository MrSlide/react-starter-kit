import os from 'os'
import payload from '.'
import commonPayload from '../../../common/logger/payload'

jest.mock('../../../common/config', function () {
  return {
    __esModule: true,
    default: function (key) { return key }
  }
})

describe('Logger server payload', function () {
  test('includes the common payload', function () {
    expect(payload).toEqual(expect.objectContaining(commonPayload))
  })

  test('includes the process ID', function () {
    expect(payload.pid).toBe(process.pid)
  })

  test('includes the host name', function () {
    expect(payload.hostname).toBe(os.hostname())
  })
})
