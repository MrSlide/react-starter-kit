import Router from '@koa/router'
import compress from '../../middleware/compress'
import appController from '../../controllers/app'

const router = new Router()

router.all(':relativeUrl(.*)?', appController, compress)

export default router
