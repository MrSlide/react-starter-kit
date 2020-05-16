import Polyglot from 'node-polyglot'
import createT from './create-t'

describe('i18n createT()', function () {
  const langCode = 'en-GB'
  const phrases = {
    test: {
      phrase: 'Hello, world!',
      placeholder: 'Hello, %{name}!',
      pluralization: '%{smart_count} test |||| %{smart_count} tests'
    }
  }
  const t = createT(langCode, phrases)

  test('returns a t function', function () {
    expect(t.constructor).toBe(Polyglot.prototype.t.constructor)
  })

  describe('returned t function', function () {
    test('provides localized strings', function () {
      const output = t('test.phrase')

      expect(output).toBe('Hello, world!')
    })

    test('provides localized strings with replaced placeholders', function () {
      const output = t('test.placeholder', {
        name: 'Test'
      })

      expect(output).toBe('Hello, Test!')
    })

    test('provides localized strings with pluralization', function () {
      const outputSingular = t('test.pluralization', {
        smart_count: 1
      })
      const outputPlural = t('test.pluralization', {
        smart_count: 2
      })

      expect(outputSingular).toBe('1 test')
      expect(outputPlural).toBe('2 tests')
    })

    test('throws an error on missing phrases', function () {
      expect(function () {
        t('test.missing')
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
