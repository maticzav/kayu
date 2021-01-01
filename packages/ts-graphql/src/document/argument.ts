import * as hasher from 'object-hash'

/**
 * Represents an argument in selection.
 * Value is internally represented as any serializable type.
 */
export type Argument = {
  /* User provided */
  name: string
  type: string
  value?: any
}

/**
 * Creates a new argument instance.
 */
export function arg<T>(name: string, type: string, value?: T): Argument {
  return { name, type, value }
}

/**
 * Returns the hash of an argument that we use to uniquely identify a selected field.
 */
export function hash(args: Argument[]): string {
  return hasher.MD5(args.map((arg) => ({ type: arg.type, value: arg.value })))
}

/**
 * Extracts a name from an alias in the response.
 */
export function getArgumentNameFromAlias(alias: string): string {
  return alias.split('_')[0]
}
