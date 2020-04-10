import send from 'koa-send'
import etag from 'etag'
import { ETAG_HEADER } from '../../../common/constants/headers'
import { STATIC_ASSETS_PATH } from '../../constants/paths'
import type http from 'http'
import type fs from 'fs'
import type Koa from 'koa'

function setHeaders (res: http.ServerResponse, path: string, stats: fs.Stats): void {
  res.setHeader(ETAG_HEADER, etag(stats))
}

const sendConfig = {
  immutable: true,
  setHeaders,
  root: STATIC_ASSETS_PATH
}

export default async function main (ctx: Koa.Context, next: Koa.Next): Promise<void> {
  const { path } = ctx.params

  try {
    await send(ctx, path, sendConfig)
  } catch (err) {
    if (err.status === 404) {
      err.message = 'Not Found'
    } else {
      err.message = 'Internal Server Error'
      err.status = 500
    }

    throw err
  }
}
