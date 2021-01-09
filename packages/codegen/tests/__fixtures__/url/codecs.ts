import { Codec } from '../../src'

export const DateCodec: Codec<Date> = {
  type: 'DateTime',
  decode: (val) => new Date(val as string),
  serialize: (date) => date.toString(),
  mock: new Date(),
}

export type DateCodec = Date
