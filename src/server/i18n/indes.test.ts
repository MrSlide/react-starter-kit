jest.mock('../constants/paths', function () {
  return {
    TRANSLATION_ASSETS_PATH: '/translations'
  }
})

jest.mock('../utils/fs', function () {
  return {
    find: function () {
      return [
        'en/test-a.json',
        'en/test-b.json',
        'en-gb/test-a.json',
        'pt-pt/test-a.json',
        'pt-pt/test-b.json'
      ]
    },
    readFile: async function (asset) {
      switch (asset) {
        case '/translations/en/test-a.json':
          return JSON.stringify({
            greeting: 'Hello, %{name}',
            test: 'This is a test'
          })
        case '/translations/en/test-b.json':
          return JSON.stringify({
            foo: 'Foo',
            bar: 'Bar'
          })
        case '/translations/en-gb/test-a.json':
          return JSON.stringify({
            greeting: 'Good day, %{name}'
          })
        case '/translations/pt-pt/test-a.json':
          return JSON.stringify({
            greeting: 'Olá, %{name}',
            test: 'Isto é um teste'
          })
        case '/translations/pt-pt/test-b.json':
          return JSON.stringify({
            foo: 'Foo',
            bar: 'Bar'
          })
      }
    }
  }
})

describe('Server side i18n', function () {
  const enabledLangs = ['en', 'en-GB']
  let i18n

  beforeEach(function () {
    process.env.CONFIG = JSON.stringify({
      localization: {
        enabledLangs,
        langMapping: {
          'en-US': 'en',
          'pt-BR': 'pt-PT'
        }
      }
    })

    i18n = require('.')
  })

  describe('init()', function () {
    test('loads the phrases', async function () {
      expect(i18n.getPhrases('en')).toBeUndefined()
      expect(i18n.getPhrases('en-GB')).toBeUndefined()

      await i18n.init()

      expect(i18n.getPhrases('en')).toMatchSnapshot()
      expect(i18n.getPhrases('en-GB')).toMatchSnapshot()
    })
  })

  describe('getAvailableLanguages()', function () {
    beforeEach(async function () {
      await i18n.init()
    })

    test('returns the loaded languages', function () {
      const output = i18n.getAvailableLanguages()

      expect(output).toEqual(enabledLangs)
    })
  })

  describe('getPhrases()', function () {
    beforeEach(async function () {
      await i18n.init()
    })

    test('returns the phrases for a language', function () {
      const output = i18n.getPhrases('en-GB')

      expect(output).toMatchSnapshot()
    })

    test('returns undefined if a language is not available', function () {
      const output = i18n.getPhrases('en-PT')

      expect(output).toBeUndefined()
    })
  })

  describe('getT()', function () {
    beforeEach(async function () {
      await i18n.init()
    })

    test('returns a t function for a specified language', function () {
      const t = i18n.getT('en-GB')

      expect(t('testA.greeting', { name: 'World' })).toBe('Good day, World')
    })

    test('returns the same t function for the same language', function () {
      const tA = i18n.getT('en-GB')
      const tB = i18n.getT('en-GB')

      expect(tA).toBe(tB)
    })

    test('throws an error if a specified language is not available', function () {
      expect(function () {
        i18n.getT('pt-PT')
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
