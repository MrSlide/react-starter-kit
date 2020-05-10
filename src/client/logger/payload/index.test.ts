/**
 * @jest-environment jsdom
 */

import payload from '.'
import commonPayload from '../../../common/logger/payload'

jest.mock('../../../common/config', function () {
  return {
    __esModule: true,
    default: function (key) { return key }
  }
})

describe('Logger browser payload', function () {
  test('includes the common payload', function () {
    expect(payload).toEqual(expect.objectContaining(commonPayload))
  })

  test('includes if cookies are enabled or disabled', function () {
    expect(payload.cookiesEnabled).toBe(window.navigator.cookieEnabled)
  })

  test('includes the device pixel ratio', function () {
    expect(payload.devicePixelRatio).toBe(window.devicePixelRatio)
  })

  test('includes the user agent', function () {
    expect(payload.ua).toBe(window.navigator.userAgent)
  })

  test('includes the viewport inner height', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'innerHeight').get).toBe('function')
    expect(payload.innerHeight).toBe(window.innerHeight)
  })

  test('includes the viewport inner width', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'innerWidth').get).toBe('function')
    expect(payload.innerWidth).toBe(window.innerWidth)
  })

  test('includes the screen orientation', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'orientation').get).toBe('function')
    expect(payload.orientation).toBe(window.screen.orientation)
  })

  test('includes the viewport horizontal scroll position', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'scrollX').get).toBe('function')
    expect(payload.scrollX).toBe(window.scrollX)
  })

  test('includes the viewport vertical scroll position', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'scrollY').get).toBe('function')
    expect(payload.scrollY).toBe(window.scrollY)
  })

  test('includes the current URL', function () {
    expect(typeof Object.getOwnPropertyDescriptor(payload, 'url').get).toBe('function')
    expect(payload.url).toBe(window.location.href)
  })
})
