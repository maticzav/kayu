import { Codec } from './codec'

/**
 * Collection of built-in scalars.
 */

export const string: Codec<string> = {
  parseValue: (t) => t as string,
  serialize: (t) => t,
  mockValue: 'Matic Zavadlal',
}

export const boolean: Codec<boolean> = {
  parseValue: (t) => t as boolean,
  serialize: (t) => t,
  mockValue: true,
}

export const int: Codec<number> = {
  parseValue: (t) => t as number,
  serialize: (t) => t,
  mockValue: 42,
}

export const float: Codec<number> = {
  parseValue: (t) => t as number,
  serialize: (t) => t,
  mockValue: 3.14,
}
