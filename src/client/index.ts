import './utils/webpack'
import render from './render'
import createStore from '../common/store'
import { getT } from '../common/utils/i18n'

declare global {
  interface Window {
    __initial_state__: object
    __lang__: string
    __phrases__: object
    __webpack_nonce__: string
  }
}

render({
  store: createStore(window.__initial_state__),
  t: getT(window.__lang__, window.__phrases__)
})
