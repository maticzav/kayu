import * as camelcase from 'camelcase'

/**
 * Checks that the given value is not undefined.
 */
export function defined<T>(val: T | undefined): val is T {
  return val !== undefined
}

/**
 * Returns the camelCased string.
 */
export function camel(val: string): string {
  return camelcase(val)
}

/**
 * Returns the PascalCased string.
 */
export function pascal(val: string): string {
  return camelcase(val, { pascalCase: true })
}
