import compose from 'koa-compose'
import mount from 'koa-mount'
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

const router = new Router()

router.use(STATIC_MOUNT_PATH, staticRouter.routes(), staticRouter.allowedMethods())
router.use(APP_MOUNT_PATH, appRouter.routes(), appRouter.allowedMethods())

export default mount(
  ROOT_MOUNT_PATH,
  compose([router.routes(), router.allowedMethods()])
)
