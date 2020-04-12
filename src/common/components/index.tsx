import React, { ReactElement, StrictMode } from 'react'
import GlobalStyles from './styles/global'

export type Props = object

/**
 * Application root component.
 *
 * @param props - The component props.
 * @public
 */
function App (): ReactElement {
  return (
    <StrictMode>
      <GlobalStyles />
      <div>Hello, world!</div>
    </StrictMode>
  )
}

export default App
