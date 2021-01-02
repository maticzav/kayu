import { IntrospectionNamedTypeRef, IntrospectionTypeRef } from 'graphql'

import { IntrospectionInvertedTypeRef, invert, revert } from '../src/ast'

describe('ref', () => {
  /**
   * Tests that we get identical values if we invert and revert
   * in arbitrary order.
   */
  test('inversion and reversion cancel out', () => {
    // ID
    const scalar: IntrospectionNamedTypeRef = { kind: 'SCALAR', name: 'ID' }
    // [[ID]!]!
    const ref: IntrospectionTypeRef = {
      kind: 'NON_NULL',
      ofType: {
        kind: 'LIST',
        ofType: {
          kind: 'NON_NULL',
          ofType: {
            kind: 'LIST',
            ofType: scalar,
          },
        },
      },
    }
    const iref: IntrospectionInvertedTypeRef = {
      kind: 'LIST',
      ofType: {
        kind: 'LIST',
        ofType: {
          kind: 'NULLABLE',
          ofType: {
            kind: 'LIST',
            ofType: {
              kind: 'NULLABLE',
              ofType: scalar,
            },
          },
        },
      },
    }

    expect(invert(revert(iref))).toEqual(iref)
    expect(revert(invert(ref))).toEqual(ref)
  })

  /**
   * Tests that the base works as expected.
   */
  test('nullability', () => {
    const scalar: IntrospectionNamedTypeRef = { kind: 'SCALAR', name: 'ID' }

    expect(invert(scalar)).toEqual({
      kind: 'NULLABLE',
      ofType: scalar,
    })

    expect(revert(scalar)).toEqual({
      kind: 'NON_NULL',
      ofType: scalar,
    })
  })
})
