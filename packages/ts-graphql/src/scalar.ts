import { Codec } from './codec'

/**
 * Collection of built-in scalars.
 */

declare global {
  interface String extends Codec<string> {}
  interface Boolean extends Codec<boolean> {}
  interface Number extends Codec<number> {}
}

// String.prototype.mockValue = 'Matic Zavadlal'
// String.prototype.serialize = () => {
//   return this?.toString()
// }
export class StringScalar implements Codec<string> {
  serialize() {
    return this
  }

  mockValue = 'Matic Zavadlal'
}
