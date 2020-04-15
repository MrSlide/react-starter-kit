import os from 'os'
import pino, { stdTimeFunctions } from 'pino'
import config from '../config'

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug'

interface AppError extends Error {
  status?: number
}

type LogMessage = string | AppError

interface LogPayload {
  [propName: string]: any
}

const logLevel = config('logging.level', 'warn')
const appVersion = config('version')
const basePayload: LogPayload = {
  env: process.env.NODE_ENV,
  version: appVersion
}

if (process.env.RUNTIME_ENV === 'node') {
  basePayload.pid = process.pid
  basePayload.hostname = os.hostname()
} else {
  basePayload.ua = window.navigator.userAgent
}

const logger = pino({
  base: basePayload,
  level: logLevel,
  prettyPrint: true,
  timestamp: stdTimeFunctions.isoTime
})

class Logger {
  /**
   * Base logger instance to dispatch logs to.
   */
  private readonly logger: typeof logger

  /**
   * Create an abstraction over the base logger.
   *
   * @param baseLogger - Base logger instance to use to dispatch logs.
   * @param payload - An object with values to be added to every log payload.
   */
  constructor (baseLogger: typeof logger, payload: LogPayload = {}) {
    this.logger = logger.child(payload)
  }

  /**
   * Dispatch a log to the base logger instance.
   *
   * @param level - The log level to dispatch.
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  private dispatch (level: LogLevel, message: LogMessage, payload?: LogPayload): void {
    const preparedPayload = { ...payload }

    if (message instanceof Error) {
      const err = message

      if (typeof err.stack !== 'undefined') {
        preparedPayload.stack = err.stack
      }
      if (typeof err.status !== 'undefined') {
        preparedPayload.status = err.status
      }

      message = err.message
    }

    this.logger[level](preparedPayload, message)
  }

  /**
   * Write a `fatal` level log.
   * Logs of a `fatal` level are intended to be logged just prior to the process exiting.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  fatal (message: LogMessage, payload?: LogPayload): void {
    this.dispatch('fatal', message, payload)
  }

  /**
   * Write an `error` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  error (message: LogMessage, payload?: LogPayload): void {
    this.dispatch('error', message, payload)
  }

  /**
   * Write a `warn` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  warn (message: LogMessage, payload?: LogPayload): void {
    this.dispatch('warn', message, payload)
  }

  /**
   * Write an `info` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  info (message: LogMessage, payload?: LogPayload): void {
    this.dispatch('info', message, payload)
  }

  /**
   * Write a `debug` level log.
   *
   * @param message - The contents of the log message.
   * @param payload - An object with values to be added to the log payload.
   */
  debug (message: LogMessage, payload?: LogPayload): void {
    this.dispatch('debug', message, payload)
  }

  /**
   * Create a logger instance with added payload values.
   *
   * @param payload - An object with values to be added to every log payload.
   */
  extend (payload): Logger {
    return new Logger(this.logger, payload)
  }
}

export default new Logger(logger)
