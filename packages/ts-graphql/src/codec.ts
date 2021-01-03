/**
 * This file contains a spec for codec "protocol"
 * that outlines how scalars are introduced to the library.
 */
export interface Codec<T> {
  /**
   * Converts JSON value to a scalar.
   */

  /**
   * Converts a scalar into a value.
   */
  serialize: () => string | number | object | null | undefined
  /**
   * The value that we use for mocking - it can be anything that represents your type.
   */
  mockValue: T
}
