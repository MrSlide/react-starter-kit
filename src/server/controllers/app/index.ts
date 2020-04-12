import type Koa from 'koa'
import render from '../../render'

function injectStyleTagNonce (styleTags: string, nonce: string): string {
  return styleTags.replace(/(?<=<style)/gm, ` nonce="${nonce}"`)
}

export default function main (ctx: Koa.Context): void {
  const { browserTarget, nonce } = ctx
  const { content, styleTags } = render()
  const entryScript = `/scripts/${browserTarget}.js`

  ctx.render('main.njk', {
    bodyContent: content,
    entryScript,
    nonce,
    styleTags: injectStyleTagNonce(styleTags, nonce)
  })
}
