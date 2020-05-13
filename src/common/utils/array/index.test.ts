import unique from './unique'
import * as array from '.'

describe('Array utilities', function () {
  test('exports unique()', function () {
    expect(array.unique).toBe(unique)
  })
})
