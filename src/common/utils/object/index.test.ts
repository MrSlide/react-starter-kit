import deepFreeze from './deep-freeze'
import * as utils from '.'

describe('Object utility functions', function () {
  test('export deepFreeze()', function () {
    expect(utils.deepFreeze).toBe(deepFreeze)
  })
})
