import {
  IntrospectionInputType,
  IntrospectionInputTypeRef,
  IntrospectionListTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionOutputType,
  IntrospectionOutputTypeRef,
  IntrospectionType,
  IntrospectionTypeRef,
} from 'graphql'

/**
 * Unwrapps the nested named type from the refernce.
 */
export function getNamedTypeRef<T>(
  ref: IntrospectionTypeRef,
): IntrospectionNamedTypeRef {
  switch (ref.kind) {
    case 'LIST': {
      return getNamedTypeRef(ref.ofType)
    }
    case 'NON_NULL': {
      return getNamedTypeRef(ref.ofType)
    }
    case 'INPUT_OBJECT':
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INTERFACE': {
      return ref
    }
  }
}

/**
 * Inverted references help us calculate data some types more easily
 * since typescript, by default, has non-null fields while GraphQL is
 * nullable by default.
 */

export interface IntrospectionNullableTypeRef<
  T extends IntrospectionTypeRef = IntrospectionTypeRef
> {
  readonly kind: 'NULLABLE'
  readonly ofType: T
}

export type IntrospectionInvertedTypeRef<T extends IntrospectionType> =
  | IntrospectionNamedTypeRef<T>
  | IntrospectionInvertedListTypeRef<any>
  | IntrospectionNullableTypeRef<
      IntrospectionNamedTypeRef<T> | IntrospectionListTypeRef<any>
    >

export interface IntrospectionInvertedListTypeRef<
  T extends IntrospectionInvertedTypeRef = IntrospectionInvertedTypeRef<any>
> {
  readonly kind: 'LIST'
  readonly ofType: T
}

export type IntrospectionInvertedOutputTypeRef = IntrospectionInvertedTypeRef<IntrospectionOutputType>

export type IntrospectionInvertedInputTypeRef = IntrospectionInvertedTypeRef<IntrospectionInputType>

/**
 * Inverts the ref to inverted instance to make type calculations easier.
 */
export function invert<T>(
  ref: IntrospectionOutputTypeRef,
): IntrospectionInvertedOutputTypeRef {
  /**
   * Every field is by default nullable (read GraphQL spec).
   * If it's wrapped to be non-nullable we simply remove the
   * nullablility wrapper that we added down in the chain.
   */
  switch (ref.kind) {
    /* Non Nullable */
    case 'NON_NULL': {
      const inverted = invert(ref.ofType)
      switch (inverted.kind) {
        case 'NULLABLE': {
          return inverted.ofType
        }
        default: {
          return inverted
        }
      }
    }
    /* Named */
    case 'LIST':
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INTERFACE': {
      return {
        kind: 'NULLABLE',
        ofType: ref,
      }
    }
  }
}

/**
 * Inverts the ref back to its original state.
 */
export function revert<T>(
  ref: IntrospectionInvertedOutputTypeRef,
): IntrospectionOutputTypeRef {
  /**
   * Every reference is now by default non-nullalbe,
   * that's why we should make every instance non-nullable
   * and remove the wrapper if we come across nullable wrapper.
   *
   * Note that we are simply changing perspective, not the values themself.
   */
  switch (ref.kind) {
    /* Nullable */
    case 'NULLABLE': {
      const reverted = revert(ref.ofType)
      switch (reverted.kind) {
        case 'NON_NULL': {
          return reverted.ofType
        }
        default: {
          return reverted
        }
      }
    }
    /* Named */
    case 'LIST':
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INTERFACE': {
      return {
        kind: 'NON_NULL',
        ofType: ref,
      }
    }
  }
}
