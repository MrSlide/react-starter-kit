import React, { ReactElement, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'
import I18nProvider from './providers/i18n'
import GlobalStyles from './styles/global'
import Nav from './example/nav'
import type { Store } from 'redux'
import type { t } from '../utils/i18n'

export interface Props {
  store: Store
  t: t
}

const ViewA = loadable(async function () {
  return await import(/* webpackChunkName: "view-a" */ './views/a')
})
const ViewB = loadable(async function () {
  return await import(/* webpackChunkName: "view-b" */ './views/b')
})

/**
 * Application root component.
 *
 * @param props - The component props.
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
            <Route component={ViewA} path='/a' />
            <Route component={ViewB} path='/b' />
          </Switch>
        </ReduxProvider>
      </I18nProvider>
    </StrictMode>
  )
}

export default App
