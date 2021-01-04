import {
  IntrospectionInputType,
  IntrospectionNamedTypeRef,
  IntrospectionOutputType,
  IntrospectionTypeRef,
} from 'graphql'

/**
 * Unwrapps the nested named type from the refernce.
 */
export function getNamedTypeRef<T>(
  ref: IntrospectionTypeRef,
): IntrospectionNamedTypeRef {
  switch (ref.kind) {
    /* List */
    case 'LIST':
      return getNamedTypeRef(ref.ofType)
    /* Non Null */
    case 'NON_NULL':
      return getNamedTypeRef(ref.ofType)

    /* Value Types */
    case 'INPUT_OBJECT':
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INTERFACE':
      return ref
  }
}

/**
 * Inverted references help us calculate data some types more easily
 * since typescript, by default, has non-null fields while GraphQL is
 * nullable by default.
 */

export interface IntrospectionInvertedListTypeRef<
  T extends IntrospectionInvertedTypeRef = IntrospectionInvertedTypeRef
> {
  readonly kind: 'LIST'
  readonly ofType: T
}

export interface IntrospectionNullableTypeRef<
  T extends IntrospectionInvertedTypeRef = IntrospectionInvertedTypeRef
> {
  readonly kind: 'NULLABLE'
  readonly ofType: T
}

export type IntrospectionInvertedTypeRef =
  | IntrospectionNamedTypeRef
  | IntrospectionInvertedListTypeRef<any>
  | IntrospectionNullableTypeRef<
      IntrospectionNamedTypeRef | IntrospectionInvertedListTypeRef<any>
    >

export type IntrospectionInvertedOutputTypeRef =
  | IntrospectionNamedTypeRef<IntrospectionOutputType>
  | IntrospectionInvertedListTypeRef<any>
  | IntrospectionNullableTypeRef<
      | IntrospectionNamedTypeRef<IntrospectionOutputType>
      | IntrospectionInvertedListTypeRef<any>
    >

export type IntrospectionInvertedInputTypeRef =
  | IntrospectionNamedTypeRef<IntrospectionInputType>
  | IntrospectionInvertedListTypeRef<any>
  | IntrospectionNullableTypeRef<
      | IntrospectionNamedTypeRef<IntrospectionInputType>
      | IntrospectionInvertedListTypeRef<any>
    >
/**
 * Inverts the ref to inverted instance to make type calculations easier.
 */
export function invert<T>(
  ref: IntrospectionTypeRef,
): IntrospectionInvertedTypeRef {
  /**
   * Every field is by default nullable (as told in GraphQL spec).
   * If it's wrapped to be non-nullable we simply remove the
   * nullablility wrapper that we added down in the chain.
   */
  switch (ref.kind) {
    /* Non Nullable */
    case 'NON_NULL':
      const inverted = invert(ref.ofType)
      switch (inverted.kind) {
        case 'NULLABLE': {
          return inverted.ofType
        }
        default: {
          return inverted
        }
      }

    /* List */
    case 'LIST':
      return {
        kind: 'NULLABLE',
        ofType: {
          kind: 'LIST',
          ofType: invert(ref.ofType),
        },
      }

    /* Named */
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INPUT_OBJECT':
    case 'INTERFACE':
      return {
        kind: 'NULLABLE',
        ofType: ref,
      }
  }
}

/**
 * Inverts the ref back to its original state.
 */
export function revert<T>(
  ref: IntrospectionInvertedTypeRef,
): IntrospectionTypeRef {
  /**
   * Every reference is now by default non-nullalbe,
   * that's why we should make every instance non-nullable
   * and remove the wrapper if we come across nullable wrapper.
   *
   * Note that we are simply changing perspective, not the values themselves.
   */
  switch (ref.kind) {
    /* Nullable */
    case 'NULLABLE':
      const reverted = revert(ref.ofType)
      switch (reverted.kind) {
        case 'NON_NULL': {
          return reverted.ofType
        }
        default: {
          return reverted
        }
      }
    /* List */
    case 'LIST':
      return {
        kind: 'NON_NULL',
        ofType: {
          kind: 'LIST',
          ofType: revert(ref.ofType),
        },
      }
    /* Named */
    case 'ENUM':
    case 'UNION':
    case 'OBJECT':
    case 'SCALAR':
    case 'INPUT_OBJECT':
    case 'INTERFACE':
      return {
        kind: 'NON_NULL',
        ofType: ref,
      }
  }
}
