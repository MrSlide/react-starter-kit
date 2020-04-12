import React, { ReactElement, StrictMode } from 'react'
import GlobalStyles from './styles/global'

function App (): ReactElement {
  return (
    <StrictMode>
      <GlobalStyles />
      <div>Hello, world!</div>
    </StrictMode>
  )
}

export default App
