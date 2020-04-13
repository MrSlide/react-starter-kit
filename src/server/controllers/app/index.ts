import type Koa from 'koa'
import render from '../../render'
import { getPhrases, getT } from '../../utils/i18n'
import createStore from '../../../common/store'

function injectStyleTagNonce (styleTags: string, nonce: string): string {
  return styleTags.replace(/(?<=<style)/gm, ` nonce="${nonce}"`)
}

/**
 * Handle requests for the main application.
 *
 * @param ctx - The context of the request.
 * @public
 */
export default function main (ctx: Koa.Context): void {
  const { browserTarget, lang, nonce } = ctx
  const phrases = getPhrases(lang)
  const store = createStore()
  const { content, styleTags } = render({
    store,
    t: getT(lang)
  })
  const entryScript = `/scripts/${browserTarget}.js`

  ctx.render('main.njk', {
    bodyContent: content,
    entryScript,
    lang,
    phrases,
    nonce,
    state: store.getState(),
    styleTags: injectStyleTagNonce(styleTags, nonce)
  })
}
