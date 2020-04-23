import type { ComponentType } from 'react'

/**
 * Get the display name of a React component.
 *
 * @param Component - A React component class or function.
 * @public
 */
export default function getComponentName<T> (Component: ComponentType<T>): string {
  const output = Component.displayName ?? Component.name

  if (typeof output === 'string' && output.length !== 0) {
    return output
  }

  return 'Component'
}
