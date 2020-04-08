import helmet from 'koa-helmet'
import { IS_DEV } from '../../common/constants/env'
import { nonce } from '../utils/csp'
import type http from 'http'

function getNonce (req: http.IncomingMessage, res: http.ServerResponse): string {
  return `'nonce-${nonce(res)}'`
}

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        getNonce
      ],
      blockAllMixedContent: true
    },
    reportOnly: IS_DEV
  },
  frameguard: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  referrerPolicy: {
    policy: 'same-origin'
  }
})
