import joinPaths from './join-paths'

describe('Routing joinPaths()', function () {
  test('joins two paths together', function () {
    const output = joinPaths('test', 'path')

    expect(output).toBe('test/path')
  })

  test('joins three paths together', function () {
    const output = joinPaths('test', 'longer', 'path')

    expect(output).toBe('test/longer/path')
  })

  test('joins any number of paths together', function () {
    const input = (new Array(25)).fill('test')
    const output = joinPaths(...input)

    expect(output).toBe(input.join('/'))
  })

  test('removes trailing slashes', function () {
    const output = joinPaths('test/', 'path/')

    expect(output).toBe('test/path')
  })

  test('removes duplicate slashes', function () {
    const output = joinPaths('test/', 'path//test')

    expect(output).toBe('test/path/test')
  })

  test('accepts absolute paths', function () {
    const output = joinPaths('/test', 'path')

    expect(output).toBe('/test/path')
  })
})
