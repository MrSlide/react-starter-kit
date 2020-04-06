import cluster from 'cluster'
import http from 'http'
import { cpus } from 'os'
import Koa from 'koa'
import config from '../common/config'
import browserTargetContext from './context/browser-target'
import logContext from './context/log'
import nonceContext from './context/nonce'
import renderViewContext from './context/render-view'
import traceIdContext from './context/trace-id'
import helmetMiddleware from './middleware/helmet'
import responseTimeMiddleware from './middleware/response-time'
import router, { rewrites } from './router'
import log from './utils/log'
import { initManifest } from './utils/static'

export function applyContext (app: Koa): void {
  browserTargetContext(app)
  logContext(app)
  nonceContext(app)
  renderViewContext(app)
  traceIdContext(app)
}

export function applyMiddleware (app: Koa): void {
  app.use(responseTimeMiddleware)
  app.use(helmetMiddleware)
}

export function applyRouter (app: Koa): void {
  app.use(rewrites)
  app.use(router)
}

async function startServer (): Promise<void> {
  const app = new Koa()
  const serverPort = config('server.port')

  applyContext(app)
  applyMiddleware(app)
  applyRouter(app)

  await initManifest()

  http.createServer(
    app.callback() // eslint-disable-line @typescript-eslint/no-misused-promises
  ).listen(serverPort)
  log.info(`Server now listening on port ${serverPort as string}`)
}

let initFails = 0

export function init (): void {
  const numCPUs = cpus().length
  const maxProcesses = config('server.maxProcesses')
  const numProcesses = Math.min(numCPUs, maxProcesses)

  if (cluster.isMaster) {
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
    startServer().catch(function (err) {
      log.error(err)
      cluster.worker.kill()
    })
  }
}

init()
