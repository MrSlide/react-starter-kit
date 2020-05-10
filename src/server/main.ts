import http from 'http'
import Koa from 'koa'
import config from '../common/config'
import browserTargetContext from './context/browser-target'
import langContext from './context/lang'
import logContext from './context/log'
import nonceContext from './context/nonce'
import renderViewContext from './context/render-view'
import traceIdContext from './context/trace-id'
import helmetMiddleware from './middleware/helmet'
import responseTimeMiddleware from './middleware/response-time'
import router, { rewrites } from './router'
import log from './logger'
import { init as initLocalization } from './utils/i18n'
import { init as initManifest } from './utils/static'

/**
 * Apply the context helpers to the Koa application.
 *
 * @param app - The Koa application to apply the context helpers to.
 */
function applyContext (app: Koa): void {
  browserTargetContext(app)
  langContext(app)
  logContext(app)
  nonceContext(app)
  renderViewContext(app)
  traceIdContext(app)
}

/**
 * Apply the global middleware to the Koa application.
 *
 * @param app - The Koa application to apply the middleware to.
 */
function applyMiddleware (app: Koa): void {
  app.use(responseTimeMiddleware)
  app.use(helmetMiddleware)
}

/**
 * Apply the routing to the Koa application.
 *
 * @param app - The Koa application to apply the routing to.
 */
function applyRouting (app: Koa): void {
  app.use(rewrites)
  app.use(router)
}

/**
 * Initialize the dependencies of the application.
 */
async function initDependencies (): Promise<void> {
  await initLocalization()
  await initManifest()
}

/**
 * Initialize the Koa application and start listening for requests.
 */
export default async function init (): Promise<void> {
  const app = new Koa()
  const serverPort = config('server.port')

  applyContext(app)
  applyMiddleware(app)
  applyRouting(app)

  await initDependencies()

  http.createServer(
    app.callback() // eslint-disable-line @typescript-eslint/no-misused-promises
  ).listen(serverPort)
  log.info(`Server now listening on port ${serverPort as string}`)
}
