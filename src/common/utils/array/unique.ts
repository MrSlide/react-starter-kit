/**
 * Creates a copy of an array with only unique elements.
 * The elements will be in the order in which they are found first.
 *
 * @param array - An array to filter.
 */
export default function unique (array: any[]): any[] {
  return Array.from(new Set(array))
}
