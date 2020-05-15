import crypto from 'crypto'
import helmet from 'koa-helmet'
import { IS_DEV } from '../../common/constants/env'
import type http from 'http'

declare module 'http' {
  interface ServerResponse {
    nonce: string
  }
}

/**
 * Gets a nonce CSP directive and makes that nonce available on the response.
 *
 * @param req - The request object created by the server.
 * @param res - The response object created by the server.
 */
function getNonce (req: http.IncomingMessage, res: http.ServerResponse): string {
  const nonce = crypto.randomBytes(16).toString('hex')

  res.nonce = nonce

  return `'nonce-${nonce}'`
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
