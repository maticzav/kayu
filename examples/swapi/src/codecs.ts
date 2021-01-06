import { Codec } from '@kayu/client'

/**
 * We are using a custom codec type - Date - in our schema.
 * Since Date is not a built-in scalar, we need to help
 * Kayu decode it if we want to access it.
 */

export const DateCodec: Codec<Date> = {
  type: 'DateTime',
  decode: (val) => new Date(val as string),
  serialize: (date) => date.toString(),
  mock: new Date(),
}

export type DateCodec = Date
