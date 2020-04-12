import React from 'react'
import ReactDom from 'react-dom'
import App from '../../common/components'

export default function render (): void {
  ReactDom.hydrate(<App />, document.getElementById('app'))
}
