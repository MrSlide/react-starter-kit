import * as headers from './headers'

describe('Header constants', function () {
  test('exports the ETag header', function () {
    expect(headers.ETAG_HEADER).toBe('ETag')
  })

  test('exports the Response Time header', function () {
    expect(headers.RESPONSE_TIME_HEADER).toBe('X-Response-Time')
  })
})
