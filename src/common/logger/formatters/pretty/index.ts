import chalk from 'chalk'
import { FormattedLog, LogLevel } from '../../types'

/**
 * Format the timestamp of the log.
 *
 * @param timestamp - A date objet to format.
 */
function formatTimestamp (timestamp: Date): string {
  return chalk.cyan(`[${timestamp.toISOString()}]`)
}

/**
 * Format the log level.
 *
 * @param level - A log level to format.
 */
function formatLevel (level: LogLevel): string {
  const strLevel = LogLevel[level].toUpperCase()

  switch (level) {
    case 0:
    case 1:
      return chalk.redBright(strLevel)
    case 2:
      return chalk.yellowBright(strLevel)
    case 3:
      return chalk.greenBright(strLevel)
    default:
      return chalk.blueBright(strLevel)
  }
}

/**
 * Format the log message.
 *
 * @param message - The log message.
 */
function formatMessage (message: string): string {
  return chalk.bold(message)
}

/**
 * Format an error stack trace.
 *
 * @param stack - An error stack trace.
 */
function formatStack (stack: string): string {
  const lines = stack.split(/\n/)

  return chalk.redBright(`  ${lines.join('\n  ')}`)
}

/**
 * Format the log payload.
 *
 * @param payload - A log payload.
 */
function formatPayload (payload: object): string {
  const lines = []

  Object.keys(payload).forEach(function (prop) {
    lines.push(`${prop}: ${chalk.bold(JSON.stringify(payload[prop]))}`)
  })

  return chalk.dim(`  ${lines.join('\n  ')}`)
}

/**
 * Format a log for human reading.
 *
 * @param log - The log to format.
 */
export default function prettyFormatter (log: FormattedLog): string {
  const { timestamp, level, message, stack, ...payload } = log
  let output = `${formatTimestamp(timestamp)} ${formatLevel(level)}: ${formatMessage(message)}`

  if (typeof stack !== 'undefined') {
    output += `\n${formatStack(stack)}`
  }

  if (Object.keys(payload).length !== 0) {
    output += `\n${formatPayload(payload)}`
  }

  return output
}
