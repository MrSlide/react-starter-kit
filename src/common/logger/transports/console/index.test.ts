import ConsoleTransport from '.'
import { LogLevel } from '../../types'

describe('Console log transport', function () {
  beforeAll(function () {
    console.error = jest.fn()
    console.warn = jest.fn()
    console.info = jest.fn()
  })

  test('dispatches fatal level logs to console.error()', function () {
    const transport = new ConsoleTransport()
    const log = {
      level: LogLevel.fatal,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.error).toHaveBeenCalledWith(log)
  })

  test('dispatches error level logs to console.error()', function () {
    const transport = new ConsoleTransport()
    const log = {
      level: LogLevel.error,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.error).toHaveBeenCalledWith(log)
  })

  test('dispatches warn level logs to console.warn()', function () {
    const transport = new ConsoleTransport()
    const log = {
      level: LogLevel.warn,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.warn).toHaveBeenCalledWith(log)
  })

  test('dispatches info level logs to console.info()', function () {
    const transport = new ConsoleTransport()
    const log = {
      level: LogLevel.info,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.info).toHaveBeenCalledWith(log)
  })

  test('dispatches debug level logs to console.info()', function () {
    const transport = new ConsoleTransport()
    const log = {
      level: LogLevel.debug,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.info).toHaveBeenCalledWith(log)
  })

  test('formats logs using a custom formatter', function () {
    const transport = new ConsoleTransport({
      formatter: function () { return 'test' }
    })
    const log = {
      level: LogLevel.debug,
      message: 'Test',
      timestamp: new Date()
    }

    transport.dispatch(log)

    expect(console.info).toHaveBeenCalledWith('test')
  })
})
