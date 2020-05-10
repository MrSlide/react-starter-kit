import { HttpError } from 'http-errors'
import { merge } from '../../../common/utils/object'
import { LogLevel } from '../types'
import type { FormattedLog, LogPayload, LogMessage, LogTransport } from '../types'

interface LoggerOptions {
  level?: LogLevel
  payload?: LogPayload
  transport: LogTransport
}

export default class Log {
  readonly level: LogLevel
  readonly payload: LogPayload
  readonly transport: LogTransport

  /**
   * Create an abstraction over the base logger.
   *
   * @param opts - Options that define how logs will be handled.
   */
  constructor (opts: LoggerOptions) {
    this.level = opts.level ?? LogLevel.info
    this.payload = opts.payload ?? {}
    this.transport = opts.transport
  }

  /**
   * Format the log payload for dispatching.
   * The message will be transformed as necessary depending on its type.
   *
   * @param level - The log level to dispatch.
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  private format (level: LogLevel, message: LogMessage, payload?: LogPayload): FormattedLog {
    const output: FormattedLog = {
      level,
      message: '',
      timestamp: new Date()
    }

    if (message instanceof HttpError || message instanceof Error) {
      const err = message

      output.stack = err.stack

      if (err instanceof HttpError) {
        output.expose = err.expose
        output.headers = err.headers
        output.statusCode = err.statusCode
      }

      if (level > LogLevel.error) {
        output.level = LogLevel.error
      }

      message = err.message
    }

    return {
      ...output,
      message,
      ...payload
    }
  }

  /**
   * Dispatch a log to the base logger instance.
   *
   * @param level - The log level to dispatch.
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  dispatch (level: LogLevel, message: LogMessage, payload?: LogPayload): void {
    if (level > this.level) {
      return
    }

    const log = this.format(level, message, {
      ...this.payload,
      ...payload
    })

    this.transport.dispatch(log)
  }

  /**
   * Write a `fatal` level log.
   * Logs of a `fatal` level are intended to be logged just prior to the process exiting.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  fatal (message: LogMessage, payload?: LogPayload): void {
    this.dispatch(LogLevel.fatal, message, payload)
  }

  /**
   * Write an `error` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  error (message: LogMessage, payload?: LogPayload): void {
    this.dispatch(LogLevel.error, message, payload)
  }

  /**
   * Write a `warn` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  warn (message: LogMessage, payload?: LogPayload): void {
    this.dispatch(LogLevel.warn, message, payload)
  }

  /**
   * Write an `info` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  info (message: LogMessage, payload?: LogPayload): void {
    this.dispatch(LogLevel.info, message, payload)
  }

  /**
   * Write a `debug` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  debug (message: LogMessage, payload?: LogPayload): void {
    this.dispatch(LogLevel.debug, message, payload)
  }

  /**
   * Create a logger instance with added payload values.
   *
   * @param opts - Options that define how logs will be handled.
   */
  extend (opts: Partial<LoggerOptions> = {}): Log {
    const { level, payload, transport } = opts

    return new Log({
      level: level ?? this.level,
      payload: typeof payload === 'object' ? merge({}, this.payload, payload) : this.payload,
      transport: transport ?? this.transport
    })
  }
}
