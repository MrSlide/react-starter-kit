import { createLogger, transports } from 'winston'
import { developmentFormat } from '../../common/utils/log'

const logLevel = process.env.LOG_LEVEL ?? 'info'

const log = createLogger({
  defaultMeta: {
    pid: process.pid
  },
  format: developmentFormat,
  level: logLevel,
  transports: [
    new transports.Console()
  ]
})

export default log
