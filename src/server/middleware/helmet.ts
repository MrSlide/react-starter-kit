import crypto from 'crypto'
import helmet from 'koa-helmet'
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
  const nonce = res.nonce ?? crypto.randomBytes(16).toString('hex')

  if (typeof res.nonce === 'undefined') {
    res.nonce = nonce
  }

  return `'nonce-${nonce}'`
}

export default helmet({
  contentSecurityPolicy: {
    directives: {
      baseUri: ["'self'"],
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: [
        "'unsafe-inline'",
        getNonce
      ],
      styleSrc: [
        "'unsafe-inline'",
        getNonce
      ],
      blockAllMixedContent: true
    }
  },
  frameguard: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  referrerPolicy: {
    policy: 'same-origin'
  }
})
