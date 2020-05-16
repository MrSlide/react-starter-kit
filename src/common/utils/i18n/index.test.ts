import createT from './create-t'
import getLangCodeAttributes from './get-lang-code-attributes'
import normalizeLangCode from './normalize-lang-code'
import * as i18n from '.'

describe('18n utilities', function () {
  test('exports createT()', function () {
    expect(i18n.createT).toBe(createT)
  })

  test('exports getLangCodeAttributes()', function () {
    expect(i18n.getLangCodeAttributes).toBe(getLangCodeAttributes)
  })

  test('exports normalizeLangCode()', function () {
    expect(i18n.normalizeLangCode).toBe(normalizeLangCode)
  })
})
