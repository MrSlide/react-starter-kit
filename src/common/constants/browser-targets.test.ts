import * as browserTargets from './browser-targets'

describe('Browser target constants', function () {
  test('exports the legacy target', function () {
    expect(browserTargets.LEGACY_TARGET).toBe('legacy')
  })

  test('exports the modern target', function () {
    expect(browserTargets.MODERN_TARGET).toBe('modern')
  })
})
