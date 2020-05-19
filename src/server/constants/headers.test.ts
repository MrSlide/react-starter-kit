import * as headers from './headers'

describe('Header constants', function () {
  test('exports the Content Language header', function () {
    expect(headers.CONTENT_LANGUAGE_HEADER).toBe('Content-Language')
  })

  test('exports the ETag header', function () {
    expect(headers.ETAG_HEADER).toBe('ETag')
  })

  test('exports the Response Time header', function () {
    expect(headers.RESPONSE_TIME_HEADER).toBe('X-Response-Time')
  })
})
