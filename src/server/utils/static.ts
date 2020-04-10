import { find } from './fs'
import { STATIC_ASSETS_PATH, STATIC_MOUNT_PATH } from '../constants/paths'

interface StaticAssetManifest {
  [propName: string]: string
}

const manifest: StaticAssetManifest = {}

/**
 * Remove a 8 character hash from a file name.
 *
 * @param filePath - A file path containing a hash.
 * @private
 */
function removeEntryHash (filePath: string): string {
  return filePath.replace(/^(.+)-[a-f0-9]{8}(\.[a-z0-9]+)*$/i, '$1$2')
}

/**
 * Remove the slash prefix of a path.
 *
 * @param path - The path to remove the slash from.
 * @private
 */
function removeSlash (path: string): string {
  return path.replace(/^\//, '')
}

/**
 * Initialize the static asset manifest.
 *
 * @public
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
 *
 * @public
 */
export function getManifest (): Readonly<StaticAssetManifest> {
  return manifest
}

/**
 * Retrieve the current file path of an asset.
 *
 * @param asset - The canonical asset path.
 * @public
 */
export function getAssetUrl (asset: string): string {
  asset = removeSlash(asset)

  const assetPath = manifest[asset]

  if (typeof assetPath === 'undefined') {
    throw new ReferenceError(`The asset '${asset}' does not exist in the manifest`)
  }

  return `${STATIC_MOUNT_PATH}/${assetPath}`
}
