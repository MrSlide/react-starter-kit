import type Koa from 'koa'
import render from '../../render'
import { getPhrases, getT } from '../../utils/i18n'
import createStore from '../../../common/store'
import config from '../../../common/config'
import { join } from '../../../common/utils/routing'

const { mainPath, rootPath } = config('routing')
const basePath = join(rootPath, mainPath)

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
  const renderProps = {
    store,
    t: getT(lang)
  }
  const renderCtx = {
    basename: basePath,
    url: join(rootPath, ctx.url)
  }
  const { content, styleTags } = render(renderProps, renderCtx)

  ctx.render('main.njk', {
    basename: basePath,
    bodyContent: content,
    entryScript: `/scripts/${browserTarget}.js`,
    lang,
    phrases,
    nonce,
    state: store.getState(),
    styleTags: injectStyleTagNonce(styleTags, nonce)
  })
}
