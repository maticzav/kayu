/**
 * This file contains helper methods that we use for code generation
 * and serve a single purpose - that's why I extracted them here.
 */
import { IntrospectionTypeRef } from 'graphql'

import { IntrospectionInvertedTypeRef, invert } from './ast'

/**
 * Wraps the given type using a given reference.
 */
export function wrap(type: string, ref: IntrospectionTypeRef): string {
  return wrapInverted(type, invert(ref))
}

/**
 * This is an internal helper function that lets us more easily define the return type
 * of the refered one.
 */
function wrapInverted(type: string, ref: IntrospectionInvertedTypeRef): string {
  switch (ref.kind) {
    /* Nullable */
    case 'NULLABLE': {
      return `(${wrapInverted(type, ref.ofType)} | null)`
    }
    /* List */
    case 'LIST': {
      return `(${wrapInverted(type, ref.ofType)}[])`
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
