export type Dict<T> = { [key: string]: T }

/**
 * Utility function that we use to make sure switch statements
 * are exhaustive.
 */
export function never(_x: never): never {
  throw new Error('Switch statement not exhaustive!')
}
