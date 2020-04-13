import React, { ReactElement, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import I18nProvider from './providers/i18n'
import GlobalStyles from './styles/global'
import Counter from './example/counter'
import type { Store } from 'redux'
import type { t } from '../utils/i18n'

export interface Props {
  store: Store
  t: t
}

/**
 * Application root component.
 *
 * @param props - The component props.
 * @public
 */
function App (props: Props): ReactElement {
  const { store, t } = props

  return (
    <StrictMode>
      <GlobalStyles />
      <I18nProvider t={t}>
        <ReduxProvider store={store}>
          <Counter />
        </ReduxProvider>
      </I18nProvider>
    </StrictMode>
  )
}

export default App
