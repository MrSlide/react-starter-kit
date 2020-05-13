/**
 * Normalizes a path so every path is treated the same.
 * It does this by removing trailing slashes.
 *
 * @param path - The path to be normalized.
 */
export default function normalizePath (path: string): string {
  path = path.replace(/\/+/g, '/')

  if (path.length > 1) {
    return path.replace(/\/$/, '')
  }

  return path
}
