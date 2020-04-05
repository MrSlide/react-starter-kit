import { createLogger, transports } from 'winston'

const log = createLogger({
  transports: [
    new transports.Console()
  ]
})

export default log
