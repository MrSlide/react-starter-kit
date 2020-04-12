import React from 'react'
import ReactDom from 'react-dom'
import App from '../../common/components'
import type { Props } from '../../common/components'

/**
 * Render the application.
 *
 * @param props - The initial props.
 * @public
 */
export default function render (props: Props): void {
  ReactDom.hydrate(
    <App {...props} />,
    document.getElementById('app')
  )
}
