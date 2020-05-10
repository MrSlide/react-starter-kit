import createHttpError from 'http-errors'
import Log from '.'
import { LogLevel } from '../types'

describe('Log handler', function () {
  let variable
  const transport = {
    dispatch: jest.fn()
  }
  const msg = 'Test message'
  const payload = {
    test: true,
    get variable () {
      return variable
    }
  }
  const err = new Error(msg)
  const httpErr = createHttpError(500, msg, { accept: 'text/html' })

  beforeEach(function () {
    variable = 'a'
  })

  describe('option', function () {
    describe('transport', function () {
      test('can be set', function () {
        const log = new Log({
          transport
        })

        expect(log.transport).toBe(transport)
      })
    })

    describe('level', function () {
      test('can be set', function () {
        const log = new Log({
          level: LogLevel.fatal,
          transport
        })

        expect(log.level).toBe(LogLevel.fatal)
      })

      test('defaults to info', function () {
        const log = new Log({
          transport
        })

        expect(log.level).toBe(LogLevel.info)
      })
    })

    describe('payload', function () {
      test('can be set', function () {
        const log = new Log({
          payload,
          transport
        })

        expect(log.payload).toBe(payload)
      })

      test('defaults to an empty payload', function () {
        const log = new Log({
          transport
        })

        expect(log.payload).toEqual({})
      })
    })
  })

  describe('dispatch()', function () {
    test('dispatches logs to the transport', function () {
      const log = new Log({
        transport
      })

      log.dispatch(LogLevel.info, msg, payload)

      expect(transport.dispatch).toHaveBeenCalledWith({
        level: LogLevel.info,
        message: msg,
        timestamp: expect.any(Date),
        ...payload
      })
    })

    test('ignores logs of lower severity than the set level', function () {
      const log = new Log({
        level: LogLevel.error,
        transport
      })

      log.dispatch(LogLevel.fatal, msg)
      log.dispatch(LogLevel.error, msg)
      log.dispatch(LogLevel.warn, msg)
      log.dispatch(LogLevel.info, msg)
      log.dispatch(LogLevel.debug, msg)

      expect(transport.dispatch).toHaveBeenCalledTimes(2)
      expect(transport.dispatch).toHaveBeenCalledWith({
        level: LogLevel.fatal,
        message: msg,
        timestamp: expect.any(Date)
      })
      expect(transport.dispatch).toHaveBeenCalledWith({
        level: LogLevel.error,
        message: msg,
        timestamp: expect.any(Date)
      })
    })

    test('parses error type messages', function () {
      const log = new Log({
        transport
      })

      log.dispatch(LogLevel.error, err, payload)

      expect(transport.dispatch).toHaveBeenCalledWith({
        level: LogLevel.error,
        message: err.message,
        stack: err.stack,
        timestamp: expect.any(Date),
        ...payload
      })
    })

    test('parses HTTP error type messages', function () {
      const log = new Log({
        transport
      })

      log.dispatch(LogLevel.error, httpErr, payload)

      expect(transport.dispatch).toHaveBeenCalledWith({
        expose: httpErr.expose,
        headers: httpErr.headers,
        level: LogLevel.error,
        message: httpErr.message,
        stack: httpErr.stack,
        statusCode: httpErr.statusCode,
        timestamp: expect.any(Date),
        ...payload
      })
    })

    test('upgrades logs to error level if the message is an error', function () {
      const log = new Log({
        transport
      })

      log.dispatch(LogLevel.info, err, payload)

      expect(transport.dispatch).toHaveBeenCalledWith({
        level: LogLevel.error,
        message: err.message,
        stack: err.stack,
        timestamp: expect.any(Date),
        ...payload
      })
    })
  })

  describe('fatal()', function () {
    const log = new Log({
      transport
    })
    log.dispatch = jest.fn()

    test('dispatches the log', function () {
      log.fatal(err, payload)

      expect(log.dispatch).toHaveBeenCalledWith(LogLevel.fatal, err, payload)
    })
  })

  describe('error()', function () {
    const log = new Log({
      transport
    })
    log.dispatch = jest.fn()

    test('dispatches the log', function () {
      log.error(err, payload)

      expect(log.dispatch).toHaveBeenCalledWith(LogLevel.error, err, payload)
    })
  })

  describe('warn()', function () {
    const log = new Log({
      transport
    })
    log.dispatch = jest.fn()

    test('dispatches the log', function () {
      log.warn(msg, payload)

      expect(log.dispatch).toHaveBeenCalledWith(LogLevel.warn, msg, payload)
    })
  })

  describe('info()', function () {
    const log = new Log({
      transport
    })
    log.dispatch = jest.fn()

    test('dispatches the log', function () {
      log.info(msg, payload)

      expect(log.dispatch).toHaveBeenCalledWith(LogLevel.info, msg, payload)
    })
  })

  describe('debug()', function () {
    const log = new Log({
      transport
    })
    log.dispatch = jest.fn()

    test('dispatches the log', function () {
      log.debug(msg, payload)

      expect(log.dispatch).toHaveBeenCalledWith(LogLevel.debug, msg, payload)
    })
  })

  describe('extend()', function () {
    test('creates a new instance with defaults from the original instance', function () {
      const log = new Log({
        level: LogLevel.warn,
        payload,
        transport
      })
      const extendedLog = log.extend()

      expect(extendedLog.level).toBe(log.level)
      expect(extendedLog.payload).toBe(log.payload)
      expect(extendedLog.transport).toBe(log.transport)
    })

    test('creates a new instance with the given options and extends the payload', function () {
      const log = new Log({
        level: LogLevel.warn,
        payload,
        transport
      })
      const newPayload = {
        extended: true
      }
      const newTransport = {
        dispatch: jest.fn()
      }
      const extendedLog = log.extend({
        level: LogLevel.debug,
        payload: newPayload,
        transport: newTransport
      })

      expect(extendedLog.level).toBe(LogLevel.debug)
      expect(extendedLog.payload).toEqual({
        ...log.payload,
        ...newPayload
      })
      expect(extendedLog.transport).toBe(newTransport)
    })

    test('the getters from the payloads remain intact', function () {
      let extendedVariable = 'a'
      const log = new Log({
        payload,
        transport
      })
      const extendedLog = log.extend({
        payload: {
          get extendedVariable () {
            return extendedVariable
          }
        }
      })

      expect(extendedLog.payload.variable).toBe(variable)
      expect(extendedLog.payload.extendedVariable).toBe(extendedVariable)

      variable = 'b'
      extendedVariable = 'b'

      expect(extendedLog.payload.variable).toBe(variable)
      expect(extendedLog.payload.extendedVariable).toBe(extendedVariable)
    })
  })
})
