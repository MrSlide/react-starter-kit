import React, { ReactElement } from 'react'
import GlobalStyles from '../providers/global-styles'

function App (): ReactElement {
  return (
    <>
      <GlobalStyles />
      <div>Hello, world!</div>
    </>
  )
}

export default App
