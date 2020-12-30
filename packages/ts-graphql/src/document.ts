import { Field } from './document/field'

/**
 * Serializes a single field into a GraphQL SDL.
 */
export function serializeField(field: Field): string {
  return '{}'
}

/**
 * Serializes a list of fields into a GraphQL SDL.
 */
export function serializeFields(fields: Field[]): string {
  return '{}'
}
