import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import { ChunkExtractor } from '@loadable/server'
import App from '../../common/components'
import type { Props } from '../../common/components'

interface RenderContext {
  basePath: string
  browserTarget: string
  bundleBasePath: string
  bundleStats: any
  nonce: string
  url: string
}

interface ServerRenderContent {
  content: string
  linkTags: string
  scriptTags: string
  styleTags: string
}

/**
 * Render the application.
 *
 * @param props - The initial props.
 */
export default function render (props: Props, ctx: RenderContext): ServerRenderContent {
  const {
    basePath,
    browserTarget,
    bundleBasePath,
    bundleStats,
    nonce,
    url
  } = ctx
  const tagAttributes = {
    nonce
  }
  const sheet = new ServerStyleSheet()
  const extractor = new ChunkExtractor({
    entrypoints: [browserTarget],
    stats: bundleStats,
    publicPath: bundleBasePath
  })

  try {
    const content = ReactDOMServer.renderToString(
      extractor.collectChunks(
        sheet.collectStyles(
          <StaticRouter basename={basePath !== '/' ? basePath : undefined} location={url}>
            <App {...props} />
          </StaticRouter>
        )
      )
    )
    const linkTags = extractor.getLinkTags(tagAttributes)
    const scriptTags = extractor.getScriptTags(tagAttributes)
    const styleTags = sheet.getStyleTags()

    return {
      content,
      linkTags,
      scriptTags,
      styleTags
    }
  } finally {
    sheet.seal()
  }
}
