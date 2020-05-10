import deepFreeze from './deep-freeze'
import merge from './merge'
import * as object from '.'

describe('Object utilities', function () {
  test('exports deepFreeze()', function () {
    expect(object.deepFreeze).toBe(deepFreeze)
  })

  test('exports merge()', function () {
    expect(object.merge).toBe(merge)
  })
})
