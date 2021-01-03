import { Codec } from './codec'

/**
 * Collection of built-in scalars.
 */

const IDCodec: Codec<string> = {
  type: 'string',
  mock: `"42"`,
  serialize: (val) => val,
  decode: (val) => val as string,
}

const StringCodec: Codec<string> = {
  type: 'string',
  mock: `"42"`,
  serialize: (val) => val,
  decode: (val) => val as string,
}

const FloatCodec: Codec<number> = {
  type: 'number',
  mock: 3.14,
  serialize: (val) => val,
  decode: (val) => parseFloat(val as string),
}

const IntCodec: Codec<number> = {
  type: 'number',
  mock: 42,
  serialize: (val) => val,
  decode: (val) => parseInt(val as string),
}

const BoolCodec: Codec<boolean> = {
  type: 'number',
  mock: true,
  serialize: (val) => String(val),
  decode: (val) => Boolean(val),
}

export const codecs = {
  ID: IDCodec,
  String: StringCodec,
  Float: FloatCodec,
  Int: IntCodec,
  Boolean: BoolCodec,
}
