import type Koa from 'koa'
import render from '../../render'
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
  const { browserTarget, nonce } = ctx
  const store = createStore({})
  const { content, styleTags } = render({
    store
  })
  const entryScript = `/scripts/${browserTarget}.js`

  ctx.render('main.njk', {
    bodyContent: content,
    entryScript,
    nonce,
    state: store.getState(),
    styleTags: injectStyleTagNonce(styleTags, nonce)
  })
}
