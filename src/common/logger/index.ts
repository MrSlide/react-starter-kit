import Log from './log'
import { Console } from './transports'
import { pretty } from './formatters'
import payload from './payload'
import { LogLevel } from './types'
import config from '../config'

export { LogLevel }

export default new Log({
  level: config('logging.level', LogLevel.warn),
  payload,
  transport: new Console({
    formatter: pretty
  })
})
