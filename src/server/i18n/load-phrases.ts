import path from 'path'
import deepMerge from 'deepmerge'
import { TRANSLATION_ASSETS_PATH } from '../constants/paths'
import { find, readFile } from '../utils/fs'
import { camelCase } from 'change-case'
import {
  getLangCodeAttributes,
  normalizeLangCode
} from '../../common/utils/i18n'
import { deepFreeze } from '../../common/utils/object'

interface LanguageAssetAttributes {
  langCode: string
  namespace: string
}

interface PhrasesNamespace {
  [namespace: string]: string | PhrasesNamespace
}

interface PhrasesBundle {
  [langCode: string]: {
    [namespace: string]: PhrasesNamespace
  }
}

interface PhrasesAsset extends LanguageAssetAttributes {
  data: PhrasesNamespace
}

/**
 * Extract the language and namespace attributes from an asset path.
 *
 * @param asset - The asset path to be parsed.
 */
function getAssetAttributes (asset: string): LanguageAssetAttributes {
  const { dir, name } = path.parse(asset)

  return {
    langCode: normalizeLangCode(dir),
    namespace: camelCase(name)
  }
}

/**
 * Load phrase data from an asset file.
 *
 * @param asset - The asset file to load.
 */
async function loadAsset (asset: string): Promise<PhrasesAsset> {
  const assetPath = path.join(TRANSLATION_ASSETS_PATH, asset)
  const data = await readFile(assetPath, 'utf8')

  return {
    data: JSON.parse(data),
    ...getAssetAttributes(asset)
  }
}

/**
 * Extend phrase data with the data of the base language.
 * This modified the given phrases bundle.
 *
 * @param phrases - The phrases data bundle.
 */
function extendPhraseData (phrases: PhrasesBundle): void {
  const langCodes = Object.keys(phrases)

  langCodes.forEach(function (langCode) {
    const { lang, region } = getLangCodeAttributes(langCode)

    if (typeof region === 'string' && typeof phrases[lang] !== 'undefined') {
      phrases[langCode] = deepMerge(phrases[lang], phrases[langCode])
    }
  })
}

/**
 * Removes phrases of languages that are unavailable.
 *
 * @param phrases - The phrases data bundle.
 */
function filterAvailableLanguages (phrases: PhrasesBundle, enabledLangs?: string[]): PhrasesBundle {
  if (!Array.isArray(enabledLangs) || enabledLangs.length === 0) {
    return phrases
  }

  const langCodes = Object.keys(phrases)
  const output = {}

  langCodes.forEach(function (langCode) {
    if (enabledLangs.includes(langCode)) {
      output[langCode] = phrases[langCode]
    }
  })

  return output
}

/**
 * Load phrase asset data.
 */
export default async function loadPhrases (enabledLangs?: string[]): Promise<PhrasesBundle> {
  const assets = await find(TRANSLATION_ASSETS_PATH, '*/*.json')
  const phrases = {}

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    const { data, langCode, namespace } = await loadAsset(asset)

    phrases[langCode] = phrases[langCode] ?? {}
    phrases[langCode][namespace] = data
  }

  extendPhraseData(phrases)

  return deepFreeze(
    filterAvailableLanguages(phrases, enabledLangs)
  )
}
