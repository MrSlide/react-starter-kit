import getComponentName from './get-component-name'
import * as react from '.'

describe('React utilities', function () {
  test('exports getComponentName()', function () {
    expect(react.getComponentName).toBe(getComponentName)
  })
})
