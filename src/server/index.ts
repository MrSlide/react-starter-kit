import http from 'http'
import Koa from 'koa'
import browserTargetContext from './context/browser-target'
import nonceContext from './context/nonce'
import renderViewContext from './context/render-view'
import traceIdContext from './context/trace-id'
import helmetMiddleware from './middleware/helmet'
import responseTimeMiddleware from './middleware/response-time'
import router, { rewrites } from './router'
import { initManifest } from './utils/static'

const app = new Koa()

browserTargetContext(app)
nonceContext(app)
renderViewContext(app)
traceIdContext(app)

app.use(responseTimeMiddleware)
app.use(helmetMiddleware)

app.use(rewrites)
app.use(router)

async function init (): Promise<void> {
  await initManifest()

  http.createServer(app.callback()).listen(8000) // eslint-disable-line @typescript-eslint/no-misused-promises
}

init().catch(console.error)
