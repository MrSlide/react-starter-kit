/**
 * Does a deep freeze of the given object so nothing can be changed in it.
 *
 * @param obj - The object to freeze.
 */
export default function deepFreeze <T> (obj: T): void {
  if (obj !== null && typeof obj === 'object') {
    Object.values(obj).forEach(deepFreeze)
    Object.freeze(obj)
  }
}
