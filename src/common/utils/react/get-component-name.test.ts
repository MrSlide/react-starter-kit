import { Component } from 'react'
import getComponentName from './get-component-name'

describe('React getComponentName()', function () {
  describe('given a class component', function () {
    test('gets a component name from the static displayName property', function () {
      class InputComponent extends Component {
        static displayName = 'Test'

        render (): null {
          return null
        }
      }

      const output = getComponentName(InputComponent)

      expect(output).toBe('Test')
    })

    test('gets a component name from the class name', function () {
      class InputComponent extends Component {
        render (): null {
          return null
        }
      }

      const output = getComponentName(InputComponent)

      expect(output).toBe('InputComponent')
    })
  })

  describe('given a functional component', function () {
    test('gets a component name from the static displayName property', function () {
      function InputComponent (): null {
        return null
      }

      InputComponent.displayName = 'Test'

      const output = getComponentName(InputComponent)

      expect(output).toBe('Test')
    })

    test('gets a component name from the function name', function () {
      function InputComponent (): null {
        return null
      }

      const output = getComponentName(InputComponent)

      expect(output).toBe('InputComponent')
    })

    test('defaults to Component', function () {
      const output = getComponentName(function (): null {
        return null
      })

      expect(output).toBe('Component')
    })
  })
})
