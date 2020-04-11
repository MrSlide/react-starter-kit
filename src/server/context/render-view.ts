import path from 'path'
import nunjucks from 'nunjucks'
import { getAssetUrl } from '../utils/static'
import type Koa from 'koa'

const viewDirectory = path.join(__dirname, 'views')
const njk = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(viewDirectory),
  {
    lstripBlocks: true,
    throwOnUndefined: true,
    trimBlocks: true
  }
)

njk.addFilter('fromManifest', getAssetUrl)

function render (view: string, ctx?: object): string {
  const output = njk.render(view, ctx)

  this.body = output
  this.set('Content-Type', 'text/html')

  return output
}

declare module 'koa' {
  interface Context {
    render: typeof render
  }
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'render', {
    value: render
  })
}
