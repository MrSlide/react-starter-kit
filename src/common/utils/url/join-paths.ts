import normalizePath from './normalize-path'

/**
 * Joins all given path segments together and normalizes the resulting path.
 *
 * @param paths - The paths to be joined.
 */
export default function joinPaths (...paths: string[]): string {
  return normalizePath(
    paths.reduce(function (acc, path): string {
      return `${acc}${path}/`
    }, '')
  )
}
