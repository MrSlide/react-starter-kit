import joinPaths from './join-paths'
import normalizePath from './normalize-path'
import * as routing from '.'

describe('Routing utils', function () {
  test('exports joinPaths()', function () {
    expect(routing.joinPaths).toBe(joinPaths)
  })

  test('exports normalizePath()', function () {
    expect(routing.normalizePath).toBe(normalizePath)
  })
})
