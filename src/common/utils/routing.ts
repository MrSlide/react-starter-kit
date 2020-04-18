/**
 * Normalizes a path so every path is treated the same.
 * It does this by removing trailing slashes.
 *
 * @param path - The path to be normalized.
 */
export function normalizePath (path: string): string {
  if (path.length > 1) {
    return path.replace(/\/$/, '')
  }

  return path
}

/**
 * Joins all given path segments together and normalizes the resulting path.
 *
 * @param paths - The paths to be joined.
 */
export function joinPaths (...paths: string[]): string {
  return normalizePath(
    paths.reduce(function (acc, path): string {
      return `${acc}/${path}`
    }, '').replace(/\/+/g, '/')
  )
}
