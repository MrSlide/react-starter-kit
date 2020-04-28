import React from 'react'
import ReactDom from 'react-dom'
import { loadableReady } from '@loadable/component'
import { BrowserRouter } from 'react-router-dom'
import config from '../../common/config'
import joinPaths from '../../common/utils/routing/join-paths'
import App from '../../common/components'
import type { Props } from '../../common/components'

const { mainPath, rootPath } = config('routing')
let basePath = joinPaths(rootPath, mainPath)

if (basePath === '/') {
  basePath = undefined
}

/**
 * Render the application.
 *
 * @param props - The initial props.
 */
export default function render (props: Props): void {
  loadableReady(function () {
    ReactDom.hydrate(
      <BrowserRouter basename={basePath}>
        <App {...props} />
      </BrowserRouter>,
      document.getElementById('app')
    )
  })
}
