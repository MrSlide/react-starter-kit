import compose from 'koa-compose'
import rewrite from 'koa-rewrite'
import Router from '@koa/router'
import staticRouter from './static'
import appRouter from './app'
import {
  APP_MOUNT_PATH,
  ROOT_MOUNT_PATH,
  STATIC_MOUNT_PATH
} from '../constants/paths'

export const rewrites = compose([
  rewrite('/favicon.ico', '/static/favicon.ico')
])

const router = new Router({
  prefix: ROOT_MOUNT_PATH
})

router.use(STATIC_MOUNT_PATH, staticRouter.routes(), staticRouter.allowedMethods())
router.use(APP_MOUNT_PATH, appRouter.routes(), appRouter.allowedMethods())

export default compose([
  router.routes(),
  router.allowedMethods()
])
