/**
 * Creates a new array with only unique elements.
 *
 * @param array - An array to filter.
 * @public
 */
export default function unique (array: any[]): any[] {
  return Array.from(new Set(array))
}
