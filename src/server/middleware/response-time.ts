import { RESPONSE_TIME_HEADER } from '../../common/constants/headers'
import type Koa from 'koa'

export default async function responseTime (ctx: Koa.Context, next: Koa.Next): Promise<void> {
  const startTime = Date.now()

  await next()

  const endTime = Date.now()
  const time = endTime - startTime

  ctx.set(RESPONSE_TIME_HEADER, `${time}ms`)
}
