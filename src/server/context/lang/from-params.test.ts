import request from 'supertest'
import Koa from 'koa'
import Router from '@koa/router'
import fromParams from './from-params'

describe('Parameters preferred language getter', function () {
  const app = new Koa()
  const router = new Router()
  let output

  router.get('/:lang?', function (ctx: Koa.Context) {
    output = fromParams(ctx, ['en', 'en-GB', 'pt-PT'])
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  test('returns the preferred language from a URL parameter', function () {
    return request(app.callback())
      .get('/en-GB')
      .then(function () {
        expect(output).toBe('en-GB')
      })
  })

  test('returns undefined if the language URL parameter is not set', function () {
    return request(app.callback())
      .get('/')
      .then(function () {
        expect(output).toBeUndefined()
      })
  })
})
