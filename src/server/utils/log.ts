import { createLogger, transports } from 'winston'

const logLevel = process.env.LOG_LEVEL ?? 'info'

const log = createLogger({
  defaultMeta: {
    pid: process.pid
  },
  level: logLevel,
  transports: [
    new transports.Console()
  ]
})

export default log
