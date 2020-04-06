import path from 'path'
import { matchesExt, readdirRecursive, stat } from './fs'
import { STATIC_PATH } from '../constants/paths'

export interface StaticAssetManifest {
  [propName: string]: string
}

const ignoredExt = ['.map', '.br', '.gz']
const manifest: StaticAssetManifest = {}

/**
 * Check if the file path should be ommited from the manifest.
 *
 * @param filePath - A file path to verify.
 * @private
 */
export async function isIgnoredEntry (filePath: string): Promise<Boolean> {
  const stats = await stat(filePath)

  return stats.isDirectory() || matchesExt(filePath, ignoredExt)
}

/**
 * Remove a 8 character hash from a file name.
 *
 * @param filePath - A file path containing a hash.
 * @private
 */
export function removeEntryHash (filePath: string): string {
  return filePath.replace(/^(.+)-[a-f0-9]{8}(\.[a-z0-9]+)*$/i, '$1$2')
}

/**
 * Remove the slash prefix of a path.
 *
 * @param path - The path to remove the slash from.
 * @private
 */
export function removeSlash (path: string): string {
  return path.replace(/^\//, '')
}

/**
 * Initialize the static asset manifest.
 *
 * @public
 */
export async function initManifest (): Promise<void> {
  const staticDir = path.join(__dirname, STATIC_PATH)
  const entries = await readdirRecursive(staticDir)

  await entries.reduce(
    async function (acc, entry): Promise<StaticAssetManifest> {
      const manifest = await acc
      const skip = await isIgnoredEntry(entry)

      if (skip === true) {
        return manifest
      }

      const relativePath = path.relative(staticDir, entry)

      manifest[removeEntryHash(relativePath)] = relativePath

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

  return `/${removeSlash(STATIC_PATH)}/${assetPath}`
}
