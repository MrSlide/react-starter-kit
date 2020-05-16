import request from 'supertest'
import Koa from 'koa'
import middleware from './compress'

const smallBody = Buffer.alloc(1, 'a', 'utf-8').toString()
const largeBody = Buffer.alloc(1024, 'a', 'utf-8').toString()

describe('Compress middleware', function () {
  const app = new Koa()

  app.use(middleware)
  app.use(function (ctx) {
    if (ctx.url === '/small') {
      ctx.body = smallBody
    } else if (ctx.url === '/large') {
      if (ctx.query.compress === 'false') {
        ctx.compress = false
      }

      ctx.body = largeBody
    }
  })

  describe('with small response bodies', function () {
    test('does not compress the response', function () {
      return request(app.callback())
        .get('/small')
        .set('Accept-Encoding', 'deflate, gzip, br')
        .then(function (ctx) {
          expect(ctx.headers['content-encoding']).toBeUndefined()
        })
    })
  })

  describe('with large response bodies', function () {
    test('compresses the response using deflate', function () {
      return request(app.callback())
        .get('/large')
        .set('Accept-Encoding', 'deflate')
        .then(function (ctx) {
          expect(ctx.headers['content-encoding']).toBe('deflate')
        })
    })

    test('compresses the response using gzip', function () {
      return request(app.callback())
        .get('/large')
        .set('Accept-Encoding', 'gzip')
        .then(function (ctx) {
          expect(ctx.headers['content-encoding']).toBe('gzip')
        })
    })

    test('does not compress the response using brotli', function () {
      return request(app.callback())
        .get('/large')
        .set('Accept-Encoding', 'br')
        .then(function (ctx) {
          expect(ctx.headers['content-encoding']).toBeUndefined()
        })
    })

    test('can be disabled per request', function () {
      return request(app.callback())
        .get('/large?compress=false')
        .set('Accept-Encoding', 'gzip')
        .then(function (ctx) {
          expect(ctx.headers['content-encoding']).toBeUndefined()
        })
    })
  })
})
