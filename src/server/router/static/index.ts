import Router from '@koa/router'
import staticController from '../../controllers/static'

const router = new Router()

router.get('/:path(.*)', staticController)

export default router
