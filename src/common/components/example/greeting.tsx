import React from 'react'
import { withT } from '../providers/i18n'
import type { ReactElement } from 'react'
import type { WithTProps } from '../providers/i18n'

/**
 * Display a greeting to the user.
 *
 * @param props - The component props.
 * @public
 */
function Greeting (props: WithTProps): ReactElement {
  const { t } = props

  return <h1>{t('example.greeting', { name: 'World' })}</h1>
}

export default withT(Greeting)
