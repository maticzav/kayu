/**
 * This file contains a spec for codec "protocol"
 * that outlines how scalars are introduced to the library.
 *
 * We assume that types starting with a lowercase letter represent
 * TypeScript's built-in types and need no importing. Every other type
 * will be imported from a given file.
 */

type JSON = string | number | null | undefined | { [key: string]: JSON }
export interface Codec<T> {
  /**
   * TypeScript type that represents it.
   */
  type: string
  /**
   * The value that we use for mocking - it can be anything that represents your type.
   */
  mock: T
  /**
   * The function that we use to decode from JSON response to a value.
   */
  decode: (json: unknown) => T
  /**
   * Converts a scalar into a JSON representable value.
   */
  serialize: (val: T) => JSON
}
