import React, { ReactElement, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import I18nProvider from './providers/i18n'
import GlobalStyles from './styles/global'
import Nav from './example/nav'
import A from './views/a'
import B from './views/b'
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
          <Nav />
          <Switch>
            <Route component={A} path='/a' />
            <Route component={B} path='/b' />
          </Switch>
        </ReduxProvider>
      </I18nProvider>
    </StrictMode>
  )
}

export default App
