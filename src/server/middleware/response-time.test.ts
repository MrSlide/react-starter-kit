import request from 'supertest'
import Koa from 'koa'
import middleware from './response-time'

describe('Response time middleware', function () {
  const app = new Koa()

  app.use(middleware)

  beforeAll(function () {
    return request(app.callback()).get('/')
  })

  test('sets the response time header', function () {
    return request(app.callback()).get('/').then(function (ctx) {
      const responseTime = ctx.headers['x-response-time']

      expect(responseTime).toEqual(expect.stringMatching(/^[0-9]+ms$/))
    })
  })
})
