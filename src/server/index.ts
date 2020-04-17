import 'source-map-support/register'
import cluster from 'cluster'
import { cpus } from 'os'
import init from './main'
import config from '../common/config'
import log from '../common/utils/log'

/**
 * Create a cluster worker process.
 *
 * @private
 */
function createWorker (): void {
  const worker = cluster.fork()

  log.info(`Created worker ${worker.process.pid}`)
}

if (cluster.isMaster) {
  const numCPUs = cpus().length
  const maxProcesses = config('server.maxProcesses')
  const numProcesses = Math.min(numCPUs, maxProcesses)

  for (let i = 0; i < numProcesses; i++) {
    createWorker()
  }

  cluster.on('exit', function (worker, exitCode) {
    if (exitCode !== 0) {
      log.warn(`Worker ${worker.process.pid} exited. Creating a new worker...`)
      createWorker()
    } else {
      log.warn(`Worker ${worker.process.pid} exited due to an unrecoverable error.`)
    }
  })
} else {
  init().catch(function (err) {
    log.error(err)
    cluster.worker.kill()
  })
}
