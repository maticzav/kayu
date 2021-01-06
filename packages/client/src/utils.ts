import { URL } from 'url'

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

/**
 * Represents a dictionary type.
 */
export type Dict<T = any> = { [key: string]: T }

/**
 * Tells whether a string is an url.
 */
export function isURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}
