import ConsoleTransport from './console'
import * as transports from '.'

describe('Log transports', function () {
  test('export the console transport', function () {
    expect(transports.Console).toBe(ConsoleTransport)
  })
})
