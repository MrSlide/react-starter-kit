import request from 'supertest'
import Koa from 'koa'
import middleware from './helmet'

jest.mock('crypto', function () {
  return {
    randomBytes: function () {
      return {
        toString: function () {
          return '96749205e2a8f06df93d202bcb1cc6b4'
        }
      }
    }
  }
})

describe('Helmet middleware', function () {
  let res
  let headers

  beforeAll(function () {
    const app = new Koa()

    app.use(middleware)
    app.use(function (ctx: Koa.Context) {
      headers = ctx.response.headers
      res = ctx.res
    })

    return request(app.callback()).get('/')
  })

  test('makes the nonce available on the response', function () {
    expect(res.nonce).toEqual(expect.stringMatching(/^[a-f0-9]{32}$/))
  })

  test('creates the correct Content Security Policy', function () {
    expect(headers['content-security-policy']).toMatchSnapshot()
  })

  test('prevents MIME type sniffing', function () {
    expect(headers['x-content-type-options']).toBe('nosniff')
  })

  test('prevents files from being opened', function () {
    expect(headers['x-download-options']).toBe('noopen')
  })

  test('disables DNS prefetching', function () {
    expect(headers['x-dns-prefetch-control']).toBe('off')
  })

  test('allows the app to be loaded from iframes of the same origin', function () {
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  })

  test('keeps users in the HTTPS version of the application', function () {
    expect(headers['strict-transport-security']).toBe('max-age=15552000; includeSubDomains')
  })

  test('hides the server type', function () {
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('accepts the referrer to be sent within the same origin', function () {
    expect(headers['referrer-policy']).toBe('same-origin')
  })

  test('blocks cross site scripting', function () {
    expect(headers['x-xss-protection']).toBe('1; mode=block')
  })
})
