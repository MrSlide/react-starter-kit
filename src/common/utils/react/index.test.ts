import getComponentName from './get-component-name'
import * as utils from '.'

describe('React utility functions', function () {
  test('export getComponentName()', function () {
    expect(utils.getComponentName).toBe(getComponentName)
  })
})
