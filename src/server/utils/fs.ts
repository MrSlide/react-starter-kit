import fs from 'fs'
import util from 'util'
import path from 'path'

export const stat = util.promisify(fs.stat)
export const readdir = util.promisify(fs.readdir)

/**
 * Checks if a file's extension matches a given extension or extensions.
 *
 * @param filePath - The path of the file to test.
 * @param extension - Extension or extensions to match against.
 */
export function matchesExt (filePath: string, extension: string[]): boolean {
  const { ext } = path.parse(filePath)
  const extensions = Array.isArray(extension) ? extension : [extension]

  return extensions.includes(ext)
}

/**
 * Reads the contents of a directory recursively.
 *
 * @param dirPath - The path to the directory to be read recursively.
 */
export async function readdirRecursive (dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath)

  return await entries.reduce(async function (
    prevResult: Promise<string[]>,
    entry: string
  ): Promise<string[]> {
    const fullPath = path.join(dirPath, entry)
    const acc = await prevResult
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      const childEntries = await readdirRecursive(fullPath)

      return acc.concat([fullPath], childEntries)
    }

    acc.push(fullPath)

    return acc
  }, Promise.resolve([]))
}
