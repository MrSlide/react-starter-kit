import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import App from '../../common/components'
import type { Props } from '../../common/components'

interface RenderContext {
  basename: string
  url: string
}

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
export default function render (props: Props, ctx: RenderContext): ServerRenderContent {
  const sheet = new ServerStyleSheet()
  let basePath = ctx.basename

  if (basePath === '/') {
    basePath = undefined
  }

  try {
    const content = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter basename={basePath} location={ctx.url}>
          <App {...props} />
        </StaticRouter>
      )
    )
    const styleTags = sheet.getStyleTags()

    return {
      content,
      styleTags
    }
  } finally {
    sheet.seal()
  }
}
