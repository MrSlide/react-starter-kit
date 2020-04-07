import http from 'http'
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

/**
 * Apply the context helpers to the Koa application.
 *
 * @param app - The Koa application to apply the context helpers to.
 * @private
 */
export function applyContext (app: Koa): void {
  browserTargetContext(app)
  logContext(app)
  nonceContext(app)
  renderViewContext(app)
  traceIdContext(app)
}

/**
 * Apply the global middleware to the Koa application.
 *
 * @param app - The Koa application to apply the middleware to.
 * @private
 */
export function applyMiddleware (app: Koa): void {
  app.use(responseTimeMiddleware)
  app.use(helmetMiddleware)
}

/**
 * Apply the routing to the Koa application.
 *
 * @param app - The Koa application to apply the routing to.
 * @private
 */
export function applyRouting (app: Koa): void {
  app.use(rewrites)
  app.use(router)
}

/**
 * Initialize the Koa application and start listening for requests.
 *
 * @public
 */
export default async function init (): Promise<void> {
  const app = new Koa()
  const serverPort = config('server.port')

  applyContext(app)
  applyMiddleware(app)
  applyRouting(app)

  await initManifest()

  http.createServer(
    app.callback() // eslint-disable-line @typescript-eslint/no-misused-promises
  ).listen(serverPort)
  log.info(`Server now listening on port ${serverPort as string}`)
}
