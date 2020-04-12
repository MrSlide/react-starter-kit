import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import App from '../../common/components'
import type { Props } from '../../common/components'

interface ServerRenderContent {
  content: string
  styleTags: string
}

/**
 * Render the application.
 *
 * @param props - The initial props.
 * @public
 */
export default function render (props: Props): ServerRenderContent {
  const sheet = new ServerStyleSheet()

  try {
    const content = ReactDOMServer.renderToString(sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleTags()

    return {
      content,
      styleTags
    }
  } finally {
    sheet.seal()
  }
}
