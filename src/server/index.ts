import cluster from 'cluster'
import { cpus } from 'os'
import listen from './server'
import config from '../common/config'
import log from './utils/log'

if (cluster.isMaster) {
  const numCPUs = cpus().length
  const maxProcesses = config('server.maxProcesses')
  const numProcesses = Math.min(numCPUs, maxProcesses)
  let initFails = 0

  for (let i = 0; i < numProcesses; i++) {
    cluster.fork()
  }

  cluster.on('exit', function (worker) {
    initFails++

    if (initFails < 3) {
      cluster.fork()
    }
  })
} else {
  listen().catch(function (err) {
    log.error(err)
    cluster.worker.kill()
  })
}
