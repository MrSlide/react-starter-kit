import unique from './unique'
import * as utils from '.'

describe('Array utility functions', function () {
  test('export unique()', function () {
    expect(utils.unique).toBe(unique)
  })
})
