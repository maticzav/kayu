export interface Codec<T> {
  /**
   * Converts JSON value to a scalar.
   */
  parseValue: (val: unknown) => T
  /**
   * Converts a scalar into a value.
   */
  serialize: (val: T) => T
  /**
   * Mock
   */
  mockValue: T
}
