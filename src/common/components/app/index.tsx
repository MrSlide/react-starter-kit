import React, { ReactElement, StrictMode } from 'react'
import GlobalStyles from '../providers/global-styles'

function App (): ReactElement {
  return (
    <StrictMode>
      <GlobalStyles />
      <div>Hello, world!</div>
    </StrictMode>
  )
}

export default App
