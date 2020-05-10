import os from 'os'
import { merge } from '../../../common/utils/object'
import commonPayload from '../../../common/logger/payload'

export default merge({}, commonPayload, {
  pid: process.pid,
  hostname: os.hostname()
})
