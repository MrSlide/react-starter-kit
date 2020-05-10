import prettyFormatter from './pretty'
import * as formatters from '.'

describe('Log formatters', function () {
  test('export the pretty formatter', function () {
    expect(formatters.pretty).toBe(prettyFormatter)
  })
})
