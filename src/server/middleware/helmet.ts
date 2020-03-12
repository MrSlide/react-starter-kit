import helmet from 'koa-helmet'
import { isDev } from '../../common/utils/app'
import { nonce } from '../utils/csp'
import type http from 'http'

export function getNonce (req: http.IncomingMessage, res: http.ServerResponse): string {
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
    reportOnly: isDev
  },
  frameguard: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  referrerPolicy: {
    policy: 'same-origin'
  }
})
