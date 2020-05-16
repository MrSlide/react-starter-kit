import normalizeLangCode from './normalize-lang-code'

describe('i18n normalizeLangCode()', function () {
  test('does not modify a standard language code', function () {
    expect(normalizeLangCode('en-GB')).toBe('en-GB')
  })

  test('normalizes a language code without region', function () {
    expect(normalizeLangCode('EN')).toBe('en')
  })

  test('normalizes a language code with region', function () {
    expect(normalizeLangCode('EN-gb')).toBe('en-GB')
  })
})
