import { LogLevel } from '../../types'
import type { FormattedLog, FormatterFn, LogTransport } from '../../types'

interface Options {
  formatter?: FormatterFn
}

export default class ConsoleTransport implements LogTransport {
  readonly formatter: FormatterFn

  constructor (opts: Options = {}) {
    this.formatter = opts.formatter
  }

  /**
   * Dispatches received log messages to the console.
   *
   * @param log - The formatted contents of the log message and payload.
   */
  dispatch (log: FormattedLog): void {
    const format = this.formatter
    const formattedLog = typeof format === 'function' ? format(log) : log

    switch (log.level) {
      case LogLevel.debug:
      case LogLevel.info:
        return console.info(formattedLog)
      case LogLevel.warn:
        return console.warn(formattedLog)
      case LogLevel.error:
      case LogLevel.fatal:
        return console.error(formattedLog)
    }
  }
}
