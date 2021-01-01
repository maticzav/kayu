import { IntrospectionNamedTypeRef, IntrospectionOutputTypeRef } from 'graphql'

/**
 * Unwrapps the nested named type from the refernce.
 */
export function getNamedTypeRef<T>(
  ref: IntrospectionOutputTypeRef,
): IntrospectionNamedTypeRef {
  switch (ref.kind) {
    case 'LIST': {
      return getNamedTypeRef(ref.ofType)
    }
    case 'NON_NULL': {
      return getNamedTypeRef(ref.ofType)
    }
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INTERFACE': {
      return ref
    }
  }
}
