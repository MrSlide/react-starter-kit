import unique from './unique'

describe('Array unique()', function () {
  test('removes duplicate values', function () {
    const anObject = { anObject: true }
    const input = ['a', 'a', 1, 1, null, null, anObject, anObject]
    const output = unique(input)

    expect(output).toEqual(['a', 1, null, anObject])
  })

  test('creates a new array without modifying the original', function () {
    const input = ['test', 'test']
    const output = unique(input)

    expect(output).not.toBe(input)
    expect(input.length).toBe(2)
    expect(input[0]).toBe('test')
    expect(input[1]).toBe('test')
  })
})
