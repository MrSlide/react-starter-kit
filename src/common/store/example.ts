import type { Action } from 'redux'
import type { RootState } from '.'

interface ExampleState {
  readonly count: number
}

interface IncrementCounterPayload {
  readonly amount?: number
}

interface ExampleAction extends Action {
  readonly payload?: IncrementCounterPayload
}

export const namespace = 'example'

const INCREMENT_COUNTER = `${namespace}/increment`

/**
 * Create an action to increment the counter by a given amount.
 *
 * @param amount - The amount to increment to the counter.
 */
export function increment (amount = 1): ExampleAction {
  return {
    type: INCREMENT_COUNTER,
    payload: {
      amount
    }
  }
}

/**
 * Get the example state slice.
 *
 * @param state - The current state of the application.
 * @private
 */
function getState (state: RootState): ExampleState {
  return state[namespace]
}

/**
 * Get the current value of the counter.
 *
 * @param state - The current state of the application.
 */
export function getCount (state: RootState): ExampleState['count'] {
  return getState(state).count
}

/**
 * Increment the value of the counter.
 *
 * @param state - The example state slice.
 * @param payload - The action payload.
 * @private
 */
function incrementReducer (state: ExampleState, payload: IncrementCounterPayload): ExampleState {
  const { count } = state
  const { amount } = payload

  return {
    ...state,
    count: count + amount
  }
}

const defaultState = {
  count: 0
}

/**
 * Example state reducer.
 *
 * @param state - The example state slice.
 * @param action - The dispatched action.
 */
export default function reduce (state: ExampleState, action: ExampleAction): ExampleState {
  const { type, payload = {} } = action

  switch (type) {
    case INCREMENT_COUNTER:
      return incrementReducer(state, payload)
    default:
      return state ?? defaultState
  }
}
