/**
 * Creates an indenting function.
 */
export function indent(spaces: number): (val: string) => string {
  const pre = ' '.repeat(spaces)
  return (val) => `${pre}${val}`
}

/**
 * Checks that the given value is not undefined.
 */
export function defined<T>(val: T | undefined): val is T {
  return val !== undefined
}
