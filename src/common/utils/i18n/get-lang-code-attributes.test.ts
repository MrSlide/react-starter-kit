import getLangCodeAttributes from './get-lang-code-attributes'

describe('i18n getLangCodeAttributes()', function () {
  test('gets the attributes of a language code without region', function () {
    const output = getLangCodeAttributes('en')

    expect(output).toEqual({
      lang: 'en',
      region: null
    })
  })

  test('gets the attributes of a language code with region', function () {
    const output = getLangCodeAttributes('en-GB')

    expect(output).toEqual({
      lang: 'en',
      region: 'GB'
    })
  })

  test('normalizes the parsed values', function () {
    const output = getLangCodeAttributes('En-gb')

    expect(output).toEqual({
      lang: 'en',
      region: 'GB'
    })
  })
})
