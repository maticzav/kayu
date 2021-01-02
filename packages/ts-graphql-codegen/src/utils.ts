export type Dict<T> = { [key: string]: T }

/**
 * Utility function that we use to make sure switch statements
 * are exhaustive.
 */
export function never(_x: never): never {
  throw new Error('Switch statement not exhaustive!')
}

/**
 * Checks that the given value is not undefined.
 */
export function defined<T>(val: T | undefined): val is T {
  return val !== undefined
}
