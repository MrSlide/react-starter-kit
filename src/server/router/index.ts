import compose from 'koa-compose'
import mount from 'koa-mount'
import rewrite from 'koa-rewrite'
import Router from '@koa/router'
import config from '../../common/config'
import staticRouter from './static'
import mainRouter from './main'

const { mainPath, rootPath, staticPath } = config('routing')

export const rewrites = compose([
  rewrite('/favicon.ico', '/static/favicon.ico')
])

const router = new Router()

router.use(staticPath, staticRouter.routes(), staticRouter.allowedMethods())
router.use(mainPath, mainRouter.routes(), mainRouter.allowedMethods())

export default mount(
  rootPath,
  compose([router.routes(), router.allowedMethods()])
)
