describe('Logger base payload', function () {
  let payload

  beforeAll(function () {
    process.env.CONFIG = JSON.stringify({
      version: '1.2.3'
    })
    process.env.NODE_ENV = 'test'

    payload = require('.').default
  })

  test('includes the application environment', function () {
    expect(payload.env).toBe('test')
  })

  test('includes the application version', function () {
    expect(payload.version).toBe('1.2.3')
  })
})
