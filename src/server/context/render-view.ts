import path from 'path'
import nunjucks from 'nunjucks'
import { getAssetPath } from '../utils/static'
import type Koa from 'koa'

const namespace = 'render'

declare module 'koa' {
  interface Context {
    [namespace]: typeof render
  }
}

const viewDirectory = path.join(__dirname, 'views')
const njk = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(viewDirectory),
  {
    lstripBlocks: true,
    throwOnUndefined: true,
    trimBlocks: true
  }
)

njk.addFilter('fromManifest', getAssetPath)

function render (view: string, ctx?: object): string {
  const output = njk.render(view, ctx)

  this.body = output
  this.set('Content-Type', 'text/html')

  return output
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    value: render
  })
}
