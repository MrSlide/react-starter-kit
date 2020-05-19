import type Koa from 'koa'

/**
 * Get the preferred language from the `Accept-Language` request header.
 *
 * @param ctx - The context of the request.
 * @param availableLangs - The list of available languages.
 */
export default function fromAcceptHeader (ctx: Koa.Context, availableLangs: string[]): string | undefined {
  const langCode = ctx.acceptsLanguages(availableLangs)

  if (typeof langCode === 'string') {
    return langCode
  }
}
