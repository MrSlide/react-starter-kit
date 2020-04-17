import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import config from '../../common/config'
import { join } from '../../common/utils/routing'
import App from '../../common/components'
import type { Props } from '../../common/components'

const { mainPath, rootPath } = config('routing')
let basePath = join(rootPath, mainPath)

if (basePath === '/') {
  basePath = undefined
}

/**
 * Render the application.
 *
 * @param props - The initial props.
 * @public
 */
export default function render (props: Props): void {
  ReactDom.hydrate(
    <BrowserRouter basename={basePath}>
      <App {...props} />
    </BrowserRouter>,
    document.getElementById('app')
  )
}
