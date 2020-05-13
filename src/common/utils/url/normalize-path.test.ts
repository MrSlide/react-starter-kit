import normalizePath from './normalize-path'

describe('Routing normalizePath()', function () {
  test('accepts absolute paths', function () {
    const output = normalizePath('/test')

    expect(output).toBe('/test')
  })

  test('removes a trailing slash', function () {
    const output = normalizePath('test/')

    expect(output).toBe('test')
  })

  test('leaves a root path unchanged', function () {
    const output = normalizePath('/')

    expect(output).toBe('/')
  })

  test('removes duplicate slashes', function () {
    const output = normalizePath('test//test')

    expect(output).toBe('test/test')
  })
})
