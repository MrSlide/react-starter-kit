import render from './render'
import createStore from '../common/store'

declare global {
  interface Window {
    __initial_state__: object
    __webpack_nonce__: string
  }
}

render({
  store: createStore(window.__initial_state__)
})
