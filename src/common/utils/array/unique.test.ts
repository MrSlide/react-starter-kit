import unique from './unique'

describe('Array unique()', function () {
  test('removes duplicate strings', function () {
    const input = ['test', 'test']
    const output = unique(input)

    expect(output).toEqual(['test'])
  })

  test('removes duplicate numbers', function () {
    const input = [1, 1]
    const output = unique(input)

    expect(output).toEqual([1])
  })

  test('removes duplicate booleans', function () {
    const input = [true, true]
    const output = unique(input)

    expect(output).toEqual([true])
  })

  test('removes duplicate dates', function () {
    const date = new Date()
    const equalDate = new Date(date.getTime())
    const input = [date, date, equalDate]
    const output = unique(input)

    expect(output).toEqual([date, equalDate])
  })

  test('removes duplicate symbols', function () {
    const symbol = Symbol('Test')
    const equalSymbol = Symbol('Test')
    const input = [symbol, symbol, equalSymbol]
    const output = unique(input)

    expect(output).toEqual([symbol, equalSymbol])
  })

  test('removes duplicate functions', function () {
    const fn = function (): void {}
    const input = [fn, fn]
    const output = unique(input)

    expect(output).toEqual([fn])
  })

  test('removes duplicate objects', function () {
    const obj = { a: 'a' }
    const equalObj = { a: 'a' }
    const input = [obj, obj, equalObj]
    const output = unique(input)

    expect(output).toEqual([obj, equalObj])
  })

  test('removes duplicate arrays', function () {
    const arr = [1]
    const equalArr = [1]
    const input = [arr, arr, equalArr]
    const output = unique(input)

    expect(output).toEqual([arr, equalArr])
  })

  test('removes duplicate maps', function () {
    const map = new Map()
    const equalMap = new Map()
    const input = [map, map, equalMap]
    const output = unique(input)

    expect(output).toEqual([map, equalMap])
  })

  test('removes duplicate sets', function () {
    const set = new Set()
    const equalSet = new Set()
    const input = [set, set, equalSet]
    const output = unique(input)

    expect(output).toEqual([set, equalSet])
  })

  test('removes duplicate errors', function () {
    const err = new Error('Test')
    const input = [err, err]
    const output = unique(input)

    expect(output).toEqual([err])
  })

  test('removes duplicate promises', function () {
    const promise = Promise.resolve()
    const input = [promise, promise]
    const output = unique(input)

    expect(output).toEqual([promise])
  })

  test('removes duplicate regular expressions', function () {
    const exp = /\[^a-z]+/
    const equalExp = /\[^a-z]+/
    const input = [exp, exp, equalExp]
    const output = unique(input)

    expect(output).toEqual([exp, equalExp])
  })

  test('removes duplicate null values', function () {
    const input = [null, null]
    const output = unique(input)

    expect(output).toEqual([null])
  })

  test('removes duplicate undefined values', function () {
    const input = [undefined, undefined]
    const output = unique(input)

    expect(output).toEqual([undefined])
  })

  test('removes duplicate mixed value types', function () {
    const input = ['test', 'test', 1, 1, true, true]
    const output = unique(input)

    expect(output).toEqual(['test', 1, true])
  })

  test('keeps the order in which values are first found', function () {
    const input = [1, 2, 3, 3, 4, 1, 5]
    const output = unique(input)

    expect(output).toEqual([1, 2, 3, 4, 5])
  })

  test('creates a new array', function () {
    const input = []
    const output = unique(input)

    expect(output).not.toBe(input)
  })
})
