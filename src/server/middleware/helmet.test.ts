import request from 'supertest'
import Koa from 'koa'
import middleware from './helmet'

jest.mock('../../common/constants/env', function () {
  return {
    IS_DEV: false
  }
})

interface HeaderDirectives {
  [propName: string]: string[] | boolean
}

/**
 * Parse CSP directives from the value of a CSP HTTP header.
 *
 * @param header - The header to parse.
 */
function parseCspDirectives (header: string): HeaderDirectives | undefined {
  if (typeof header === 'undefined' || header === '') {
    return
  }

  return header.split('; ').reduce(function (acc, directive) {
    const [type, ...values] = directive.split(' ')

    acc[type] = values.length > 1 ? values : true

    return acc
  }, {})
}

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

  describe('Content security policy', function () {
    let csp

    beforeAll(function () {
      csp = parseCspDirectives(headers['content-security-policy'])
    })

    test('accepts content from the same origin', function () {
      expect(csp['default-src']).toEqual(expect.arrayContaining([
        "'self'"
      ]))
    })

    test('accepts content with a nonce', function () {
      expect(csp['default-src']).toEqual(expect.arrayContaining([
        expect.stringMatching(/^'nonce-[a-f0-9]{32}'$/)
      ]))
    })

    test('blocks mixed content', function () {
      expect(csp['block-all-mixed-content']).toBe(true)
    })
  })

  describe('Content type options', function () {
    test('prevent MIME type sniffing', function () {
      expect(headers['x-content-type-options']).toBe('nosniff')
    })
  })

  describe('Download options', function () {
    test('prevents files from being opened', function () {
      expect(headers['x-download-options']).toBe('noopen')
    })
  })

  describe('DNS prefetch control', function () {
    test('disables DNS prefetching', function () {
      expect(headers['x-dns-prefetch-control']).toBe('off')
    })
  })

  describe('Frame options', function () {
    test('allows the app to be loaded from iframes of the same origin', function () {
      expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    })
  })

  describe('HTTP strict transport security', function () {
    test('keeps users in the HTTPS version of the application', function () {
      expect(headers['strict-transport-security']).toBe('max-age=15552000; includeSubDomains')
    })
  })

  describe('Powered by', function () {
    test('does not reveal the server type', function () {
      expect(headers['x-powered-by']).toBeUndefined()
    })
  })

  describe('Referrer policy', function () {
    test('accepts the referrer to be passed within the same origin', function () {
      expect(headers['referrer-policy']).toBe('same-origin')
    })
  })

  describe('XSS protection', function () {
    test('blocks cross site scripting', function () {
      expect(headers['x-xss-protection']).toBe('1; mode=block')
    })
  })
})
