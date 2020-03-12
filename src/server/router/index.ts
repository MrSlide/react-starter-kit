import compose from 'koa-compose'
import rewrite from 'koa-rewrite'
import Router from '@koa/router'
import staticRouter from './static'
import appRouter from './app'

export const rewrites = compose([
  rewrite('/favicon.ico', '/static/favicon.ico')
])

const router = new Router()

router.use('/static', staticRouter.routes(), staticRouter.allowedMethods())
router.use(appRouter.routes(), appRouter.allowedMethods())

export default compose([
  router.routes(),
  router.allowedMethods()
])
