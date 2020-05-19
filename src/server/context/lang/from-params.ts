import type Koa from 'koa'

/**
* Get the preferred language from the route parameters.
* This relies on the route having a `lang` parameter set up.
*
* @param ctx - The context of the request.
* @param availableLangs - The list of available languages.
*/
export default function fromParams (ctx: Koa.Context, availableLangs: string[]): string | undefined {
  const { params: { lang } } = ctx

  if (!availableLangs.includes(lang)) {
    return
  }

  return lang
}
