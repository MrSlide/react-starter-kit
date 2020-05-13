import joinPaths from './join-paths'
import normalizePath from './normalize-path'
import * as url from '.'

describe('URL utils', function () {
  test('exports joinPaths()', function () {
    expect(url.joinPaths).toBe(joinPaths)
  })

  test('exports normalizePath()', function () {
    expect(url.normalizePath).toBe(normalizePath)
  })
})
