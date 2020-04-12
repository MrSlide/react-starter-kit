import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import App from '../../common/components'

interface ServerRenderContent {
  content: string
  styleTags: string
}

export default function render (): ServerRenderContent {
  const sheet = new ServerStyleSheet()

  try {
    const content = ReactDOMServer.renderToString(sheet.collectStyles(<App />))
    const styleTags = sheet.getStyleTags()

    return {
      content,
      styleTags
    }
  } finally {
    sheet.seal()
  }
}
