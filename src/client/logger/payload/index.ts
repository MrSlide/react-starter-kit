import { merge } from '../../../common/utils/object'
import commonPayload from '../../../common/logger/payload'

export default merge({}, commonPayload, {
  cookiesEnabled: window.navigator.cookieEnabled,
  devicePixelRatio: window.devicePixelRatio,
  ua: window.navigator.userAgent,
  get innerHeight () {
    return window.innerHeight
  },
  get innerWidth () {
    return window.innerWidth
  },
  get orientation () {
    return window.screen.orientation
  },
  get scrollX () {
    return window.scrollX
  },
  get scrollY () {
    return window.scrollY
  },
  get url () {
    return window.location.href
  }
})
