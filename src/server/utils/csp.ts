import crypto from 'crypto'
import type http from 'http'

/**
 * Generate a nonce string.
 *
 * @public
 */
export function generateNonce (): string {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Get the existing nonce associated with a server response.
 * If one doesn't exist yet, a new one will be created.
 *
 * @param res - The server response object the nonce relates to.
 * @public
 */
export function nonce (res: http.ServerResponse): string {
  const response: any = res
  const nonce = response.nonce ?? generateNonce()

  response.nonce = nonce

  return nonce
}
