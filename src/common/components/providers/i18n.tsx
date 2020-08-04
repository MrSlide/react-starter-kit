import React, { createContext } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { getComponentName } from '../../utils/react'
import type {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  ReactElement
} from 'react'
import { IS_DEV } from '../../constants/env'
import type Polyglot from 'node-polyglot'

type t = Polyglot['t']

export interface WithTProps {
  readonly t: t
}

const I18nContext = createContext(null)

/**
 * Provides an i18n context.
 *
 * @param props - Component props.
 */
export default function I18nProvider (props: PropsWithChildren<WithTProps>): ReactElement {
  const { children, t } = props

  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>
}

I18nProvider.displayName = 'I18nProvider'

/**
 * Gives a component a translation function `t`.
 *
 * @param Component - The component to wrap.
 */
export function withT <T extends WithTProps, W = Omit<T, 't'>> (WrappedComponent: ComponentType<T>): FunctionComponent<W> {
  function WithT (props: W): ReactElement {
    return (
      <I18nContext.Consumer>
        {function (t: t) {
          const newProps = ({ ...props, t } as unknown) as T

          return <WrappedComponent {...newProps} />
        }}
      </I18nContext.Consumer>
    )
  }

  hoistNonReactStatic(WithT, WrappedComponent)

  if (IS_DEV) {
    WithT.displayName = `withT(${getComponentName(WrappedComponent)})`
    WithT.WrappedComponent = WrappedComponent
  }

  return WithT
}
