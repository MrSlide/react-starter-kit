import loadPhrases from './load-phrases'

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
            greeting: 'Hello, World',
            test: 'This is a test'
          })
        case '/translations/en/test-b.json':
          return JSON.stringify({
            foo: 'Foo',
            bar: 'Bar'
          })
        case '/translations/en-gb/test-a.json':
          return JSON.stringify({
            greeting: 'Good day, World'
          })
        case '/translations/pt-pt/test-a.json':
          return JSON.stringify({
            greeting: 'Olá, Mundo',
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

describe('i18n phrase loading', function () {
  test('loads all phrases with extended translations by default', async function () {
    const output = await loadPhrases()

    expect(output).toMatchSnapshot()
  })

  test('loads all phrases with extended translations if given an empty list of enabled languages', async function () {
    const output = await loadPhrases([])

    expect(output).toMatchSnapshot()
  })

  test('loads the enabled language phrases with extended translations', async function () {
    const output = await loadPhrases(['en-GB'])

    expect(output).toMatchSnapshot()
  })

  test('freezes the phrases', async function () {
    const output = await loadPhrases()

    expect(Object.isFrozen(output)).toBe(true)
  })
})
