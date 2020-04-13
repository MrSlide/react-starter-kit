import type { ComponentType } from 'react'

/**
 * Get the display name of a React component.
 *
 * @param Component - A React component class or function.
 * @public
 */
export function getComponentName<T> (Component: ComponentType<T>): string {
  return Component.displayName ?? Component.name ?? 'Component'
}
