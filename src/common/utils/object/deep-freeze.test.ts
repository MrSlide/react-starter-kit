import deepFreeze from './deep-freeze'

describe('Object deepFreeze()', function () {
  test('freezes an object', function () {
    const input = {
      test: true
    }

    deepFreeze(input)

    expect(Object.isFrozen(input)).toBe(true)
  })

  test('freezes a nested object', function () {
    const input = {
      nested: {
        test: true
      }
    }

    deepFreeze(input)

    expect(Object.isFrozen(input.nested)).toBe(true)
  })

  test('freezes an array', function () {
    const input = ['test']

    deepFreeze(input)

    expect(Object.isFrozen(input)).toBe(true)
  })

  test('freezes a nested array', function () {
    const input = [['test']]

    deepFreeze(input)

    expect(Object.isFrozen(input[0])).toBe(true)
  })
})
