import { format } from 'winston'
import colors from 'colors/safe'

export const developmentFormat = format.combine(
  format.colorize(),
  format.errors({ stack: true }),
  format.metadata(),
  format.timestamp(),
  format.printf(function (info): string {
    const { level, message, metadata, timestamp } = info

    return `${colors.cyan(timestamp)} ${level} ${message} ${colors.gray(metadata)}`
  })
)
