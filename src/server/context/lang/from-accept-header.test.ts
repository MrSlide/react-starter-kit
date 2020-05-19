import request from 'supertest'
import Koa from 'koa'
import fromAcceptHeader from './from-accept-header'

describe('Accept-Language header preferred language getter', function () {
  const app = new Koa()
  let output

  app.use(function (ctx: Koa.Context) {
    output = fromAcceptHeader(ctx, ['en', 'en-GB', 'pt-PT'])
  })

  test('returns the best match from the available languages', function () {
    return request(app.callback())
      .get('/')
      .set('Accept-Language', 'fr-CH, en-GB;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
      .then(function () {
        expect(output).toBe('en-GB')
      })
  })

  test('returns undefined if no match is available', function () {
    return request(app.callback())
      .get('/')
      .set('Accept-Language', 'fr-CH, de;q=0.7, es;q=0.5')
      .then(function () {
        expect(output).toBeUndefined()
      })
  })
})
