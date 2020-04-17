import Router from '@koa/router'
import compress from '../../middleware/compress'
import mainController from '../../controllers/main'

const router = new Router()

router.all(':relativeUrl(.*)?', mainController, compress)

export default router
