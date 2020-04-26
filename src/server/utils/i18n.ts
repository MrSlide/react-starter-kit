import path from 'path'
import deepMerge from 'deepmerge'
import config from '../../common/config'
import { TRANSLATION_ASSETS_PATH } from '../constants/paths'
import unique from '../../common/utils/array/unique'
import {
  getLangCodeAttributes,
  getT as getTFn,
  normalizeLangCode
} from '../../common/utils/i18n'
import deepFreeze from '../../common/utils/object/deep-freeze'
import { camelCase } from 'change-case'
import { find, readFile } from './fs'
import type { t } from '../../common/utils/i18n'
import log from '../../common/utils/log'

interface LanguageAssetAttributes {
  langCode: string
  namespace: string
}

const defaultLang: string = config('localization.defaultLang')
const enabledLangs: string[] = config('localization.enabledLangs', [])
const langMapping: object = config('localization.langMapping', {})

const phrases = {}
const tFns = {}

/**
 * Load phrase data from an asset file.
 *
 * @param asset - The asset file to load.
 * @private
 */
async function loadAsset (asset: string): Promise<object> {
  const assetPath = path.join(TRANSLATION_ASSETS_PATH, asset)
  const data = await readFile(assetPath, 'utf8')

  return JSON.parse(data)
}

/**
 * Extract the language and namespace attributes from an asset path.
 *
 * @param asset - The asset path to be parsed.
 * @private
 */
function getAssetAttributes (asset: string): LanguageAssetAttributes {
  const { dir, name } = path.parse(asset)

  return {
    langCode: normalizeLangCode(dir),
    namespace: camelCase(name)
  }
}

/**
 * Extend phrase data with the data of the base language.
 *
 * @param langCode - The language code of the phrase data.
 * @param data - The phrase data to be extended.
 * @private
 */
function extendPhraseData (langCode: string, data: object): object {
  const { lang, region } = getLangCodeAttributes(langCode)

  if (typeof region === 'string' && phrases[lang] !== 'undefined') {
    return deepMerge(phrases[lang], data)
  }

  return data
}

/**
 * Removes phrases of languages that are unavailable.
 *
 * @private
 */
function filterAvailableLanguages (): void {
  if (enabledLangs.length === 0) {
    return
  }

  const langCodes = Object.keys(phrases)

  langCodes.forEach(function (langCode) {
    if (!enabledLangs.includes(langCode)) {
      delete phrases[langCode] // eslint-disable-line @typescript-eslint/no-dynamic-delete
    }
  })
}

/**
 * Load phrase asset data.
 *
 * @private
 */
async function loadPhrases (): Promise<void> {
  const assets = await find(TRANSLATION_ASSETS_PATH, '*/*.json')

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    const { langCode, namespace } = getAssetAttributes(asset)
    const data = await loadAsset(asset)

    phrases[langCode] = phrases[langCode] ?? {}
    phrases[langCode][namespace] = extendPhraseData(langCode, data)
  }

  filterAvailableLanguages()
  deepFreeze(phrases)
}

/**
 * Create translation functions for each available language.
 *
 * @private
 */
function createTFns (): void {
  const langCodes = Object.keys(phrases)

  langCodes.forEach(function (langCode) {
    const phrasesBundle = getPhrases(langCode)

    tFns[langCode] = getTFn(langCode, phrasesBundle)
  })
}

/**
 * Get the list of languages available to use.
 *
 * @private
 */
export function getAvailableLanguages (): string[] {
  const loadedLangs = Object.keys(phrases)
  const mappedLangs = Object.keys(langMapping).filter(function (langCode) {
    return loadedLangs.includes(langMapping[langCode])
  })

  return unique([...loadedLangs, ...mappedLangs])
}

/**
 * Get a phrase bundle for a language.
 *
 * @param langCode - The language to get phrases for.
 * @public
 */
export function getPhrases (langCode: string): object {
  const bundle = phrases[langCode]

  if (typeof bundle === 'undefined') {
    throw new ReferenceError(`The language '${langCode}' is not available.`)
  }

  return bundle
}

/**
 * Get a translation function for a language.
 *
 * @param langCode - The language to get a translation function for.
 * @public
 */
export function getT (langCode: string): t {
  const fn = tFns[langCode]

  if (typeof fn === 'undefined') {
    throw new ReferenceError(`The language '${langCode}' is not available.`)
  }

  return fn
}

/**
 * Initiliaze the localization data and functions.
 *
 * @public
 */
export async function init (): Promise<void> {
  if (typeof defaultLang !== 'string') {
    throw new Error('No default language is set in the configuration.')
  }

  if (!Array.isArray(enabledLangs) || enabledLangs.length === 0) {
    log.warn('No enabled languages are set in the configuration. All available languages will be used.')
  }

  await loadPhrases()
  createTFns()
}
