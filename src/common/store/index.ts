import { combineReducers, createStore } from 'redux'
import example, { namespace as exampleNamespace } from './example'
import type { Store } from 'redux'

export interface RootState {
  readonly [exampleNamespace]: ReturnType<typeof example>
}

const reducers = combineReducers({
  [exampleNamespace]: example
})

/**
 * Create a Redux store instance.
 *
 * @param initialState - The initial state of the store.
 */
export default function create (initialState: Partial<RootState> = {}): Store {
  const store = createStore(reducers, initialState)

  return store
}
