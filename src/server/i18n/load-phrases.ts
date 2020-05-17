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
import config from '../../common/config'

interface LanguageAssetAttributes {
  langCode: string
  namespace: string
}

interface PhrasesAsset extends LanguageAssetAttributes {
  data: object
}

const enabledLangs: string[] = config('localization.enabledLangs', [])

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
 *
 * @param phrases - The phrases data bundle.
 * @param langCode - The language code of the phrase data.
 * @param data - The phrase data to be extended.
 */
function extendPhraseData (phrases: object, langCode: string, data: object): object {
  const { lang, region } = getLangCodeAttributes(langCode)

  if (typeof region === 'string' && phrases[lang] !== 'undefined') {
    return deepMerge(phrases[lang], data)
  }

  return data
}

/**
 * Removes phrases of languages that are unavailable.
 *
 * @param phrases - The phrases data bundle.
 */
function filterAvailableLanguages (phrases: object): object {
  if (enabledLangs.length === 0) {
    return
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
export default async function loadPhrases (): Promise<object> {
  const assets = await find(TRANSLATION_ASSETS_PATH, '*/*.json')
  const phrases = {}

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    const { data, langCode, namespace } = await loadAsset(asset)

    phrases[langCode] = phrases[langCode] ?? {}
    phrases[langCode][namespace] = extendPhraseData(phrases, langCode, data)
  }

  return deepFreeze(
    filterAvailableLanguages(phrases)
  )
}
