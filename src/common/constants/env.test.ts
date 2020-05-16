describe('Env constants', function () {
  describe('in a development environment', function () {
    let env

    beforeAll(function () {
      process.env.NODE_ENV = 'development'

      env = jest.requireActual('./env')
    })

    test('exports the development environment flag', function () {
      expect(env.IS_DEV).toBe(true)
    })
  })

  describe('in a production environment', function () {
    let env

    beforeAll(function () {
      process.env.NODE_ENV = 'production'

      env = jest.requireActual('./env')
    })

    test('exports the development environment flag', function () {
      expect(env.IS_DEV).toBe(false)
    })
  })

  describe('in a any other environment', function () {
    let env

    beforeAll(function () {
      process.env.NODE_ENV = 'test'

      env = jest.requireActual('./env')
    })

    test('exports the development environment flag', function () {
      expect(env.IS_DEV).toBe(true)
    })
  })
})
