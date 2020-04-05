/**
 * Does a deep freeze of the given object so nothing can be changed in it.
 *
 * @param obj - The object to freeze.
 * @public
 */
export function deepFreeze <T> (obj: T): T {
  if (obj !== null && typeof obj === 'object') {
    Object.values(obj).forEach(deepFreeze)
    Object.freeze(obj)
  }

  return obj
}
