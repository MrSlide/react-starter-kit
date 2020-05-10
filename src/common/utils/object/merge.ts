/**
 * Clones all enumerable own properties from one or more source objects to a target object.
 *
 * @param target - The object to apply the sources’ properties to, which is returned after it is modified.
 * @param sources - Objects containing the properties you want to apply.
 */
export default function merge (target: any, ...sources: any[]): any {
  sources.forEach(function (obj) {
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(obj))
  })

  return target
}
