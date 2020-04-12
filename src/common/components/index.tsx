import React, { ReactElement, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import GlobalStyles from './styles/global'
import Counter from './example/counter'
import type { Store } from 'redux'

export interface Props {
  store: Store
}

/**
 * Application root component.
 *
 * @param props - The component props.
 * @public
 */
function App (props: Props): ReactElement {
  const { store } = props

  return (
    <StrictMode>
      <GlobalStyles />
      <ReduxProvider store={store}>
        <Counter />
      </ReduxProvider>
    </StrictMode>
  )
}

export default App
