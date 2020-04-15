import React, { createContext } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { getComponentName } from '../../utils/react'
import type {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode
} from 'react'
import { IS_DEV } from '../../constants/env'
import type { t } from '../../utils/i18n'

const I18nContext = createContext(null)

I18nContext.displayName = 'I18n'

export interface WithTProps {
  readonly t: t
}

interface ProviderProps extends WithTProps {
  readonly children: ReactNode
}

/**
 * Provides an i18n context.
 *
 * @param props - Component props.
 * @public
 */
export default function I18nProvider (props: ProviderProps): ReactElement {
  const { children, t } = props

  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>
}

/**
 * Gives a component a translation function `t`.
 *
 * @param WrappedComponent - The component to wrap.
 * @public
 */
export function withT<T> (WrappedComponent: ComponentType<T>): FunctionComponent {
  function WithT (props): ReactElement {
    return (
      <I18nContext.Consumer>
        {function (t: t) {
          return <WrappedComponent t={t} {...(props as T)} />
        }}
      </I18nContext.Consumer>
    )
  }

  hoistNonReactStatic(WithT, WrappedComponent)

  if (IS_DEV) {
    WithT.displayName = `withT(${getComponentName(WrappedComponent)})`
  }

  return WithT
}
