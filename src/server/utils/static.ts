import { find } from './fs'
import config from '../../common/config'
import { joinPaths } from '../../common/utils/url'
import { STATIC_ASSETS_PATH } from '../constants/paths'

interface StaticAssetManifest {
  [propName: string]: string
}

const manifest: StaticAssetManifest = {}
const { staticPath, rootPath } = config('routing')
const baseStaticPath = joinPaths(rootPath, staticPath)

/**
 * Remove a 8 character hash from a file name.
 *
 * @param filePath - A file path containing a hash.
 */
function removeEntryHash (filePath: string): string {
  return filePath.replace(/^(.+)-[a-f0-9]{8}(\.[a-z0-9]+)*$/i, '$1$2')
}

/**
 * Remove the slash prefix of a path.
 *
 * @param path - The path to remove the slash from.
 */
function removeSlash (path: string): string {
  return path.replace(/^\//, '')
}

/**
 * Initialize the static asset manifest.
 */
export async function init (): Promise<void> {
  const entries = await find(STATIC_ASSETS_PATH, '**/!(*.map|*.br|*.gz)')

  await entries.reduce(
    async function (acc, entry): Promise<StaticAssetManifest> {
      const manifest = await acc

      manifest[removeEntryHash(entry)] = entry

      return manifest
    },
    Promise.resolve(manifest)
  )
}

/**
 * Get the full static asset manifest.
 */
export function getManifest (): Readonly<StaticAssetManifest> {
  return manifest
}

/**
 * Retrieve the current file path of an asset.
 *
 * @param asset - The canonical asset path.
 */
export function getAssetPath (asset: string): string {
  asset = removeSlash(asset)

  const assetPath = manifest[asset]

  if (typeof assetPath === 'undefined') {
    throw new ReferenceError(`The asset '${asset}' does not exist in the manifest`)
  }

  return joinPaths(baseStaticPath, assetPath)
}
