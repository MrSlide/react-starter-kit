import latinize from 'latinize'

/**
 * Prepares a string for case conversion by breaking it down to its elements.
 *
 * @param str - The string to prepare for case conversion.
 * @private
 */
function toCasingWords (str: string): string[] {
  return latinize(str)
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
}

/**
 * Converts a string to camel case.
 *
 * @param str - The string to convert to camel case.
 */
export function toCamelCase (str: string): string {
  return toCasingWords(str).map(function (word, index) {
    if (index === 0) {
      return word.toLowerCase()
    } else {
      return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
    }
  }).join()
}
