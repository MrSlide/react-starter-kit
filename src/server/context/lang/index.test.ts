import request from 'supertest'
import Koa from 'koa'
import Router from '@koa/router'

jest.mock('../../i18n', function () {
  return {
    getAvailableLanguages: function () {
      return ['en', 'en-GB', 'pt-PT', 'es']
    }
  }
})

describe('Preferred language context', function () {
  let app
  let output

  beforeEach(function () {
    process.env.CONFIG = JSON.stringify({
      localization: {
        defaultLang: 'es'
      }
    })

    app = new Koa()

    const router = new Router()
    const langCtx = require('.').default

    langCtx(app)

    router.get('/:lang?', function (ctx: Koa.Context) {
      output = ctx
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
  })

  test('retrieves the preferred language from the URL parameters first', function () {
    return request(app.callback())
      .get('/pt-PT')
      .set('Accept-Language', 'fr-CH, en-GB;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
      .then(function () {
        expect(output.lang).toBe('pt-PT')
      })
  })

  test('retrieves the preferred language from the Accept-Language header if the URL parameter is not present', function () {
    return request(app.callback())
      .get('/')
      .set('Accept-Language', 'fr-CH, pt-PT;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
      .then(function () {
        expect(output.lang).toBe('pt-PT')
      })
  })

  test('defaults to the default language', function () {
    return request(app.callback())
      .get('/')
      .set('Accept-Language', '')
      .then(function () {
        expect(output.lang).toBe('es')
      })
  })

  test('is a lazy getter', function () {
    return request(app.callback())
      .get('/')
      .then(function () {
        expect(typeof Object.getOwnPropertyDescriptor(app.context, 'lang').get).toBe('function')
        expect(output.lang).toBe('en')
        expect(typeof Object.getOwnPropertyDescriptor(output, 'lang').get).toBe('undefined')
      })
  })

  test('throws an error if a default language is not set', function () {
    jest.resetModules()

    process.env.CONFIG = JSON.stringify({
      localization: {}
    })

    expect(function () {
      require('.')
    }).toThrowErrorMatchingSnapshot()
  })
})
