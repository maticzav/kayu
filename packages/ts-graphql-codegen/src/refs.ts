/**
 * This file contains helper methods that we use for code generation
 * and serve a single purpose - that's why I extracted them here.
 */
import { IntrospectionTypeRef } from 'graphql'

import { IntrospectionInvertedTypeRef, invert } from './ast'

/**
 * Wraps the given type using a given reference to a GraphQL SDL type.
 *
 * @param type - The chunk that we are wrapping.
 * @param ref - The reference that we use as a wrapping base.
 */
export function wrapGraphQLSDL(
  type: string,
  ref: IntrospectionTypeRef,
): string {
  switch (ref.kind) {
    /* Non Null */
    case 'NON_NULL':
      return `${wrapGraphQLSDL(type, ref.ofType)}!`

    /* List */
    case 'LIST':
      return `[${wrapGraphQLSDL(type, ref.ofType)}]`
    /* Named */
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INPUT_OBJECT':
    case 'INTERFACE':
      return type
  }
}

/**
 * Wraps the given type using a given reference.
 *
 * @param type - The chunk that we are wrapping.
 * @param ref - The reference that we use as a wrapping base.
 * @param optionals - Tells whether `null` values may be undefined.
 */
export function wrap(
  type: string,
  ref: IntrospectionTypeRef,
  optionals: boolean = false,
): string {
  return wrapInverted(type, invert(ref), optionals)
}

/**
 * This is an internal helper function that lets us more easily define the return type
 * of the refered one.
 */
function wrapInverted(
  type: string,
  ref: IntrospectionInvertedTypeRef,
  optionals: boolean,
): string {
  switch (ref.kind) {
    /* Nullable */
    case 'NULLABLE': {
      const wrapped = wrapInverted(type, ref.ofType, optionals)

      if (optionals) return `${wrapped} | null | undefined`
      return `${wrapped} | null`
    }
    /* List */
    case 'LIST': {
      return `Array<${wrapInverted(type, ref.ofType, optionals)}>`
    }
    /* Named */
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INPUT_OBJECT':
    case 'INTERFACE': {
      return type
    }
  }
}
