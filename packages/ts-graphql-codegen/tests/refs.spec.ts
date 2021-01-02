import { IntrospectionNamedTypeRef, IntrospectionTypeRef } from 'graphql'

import { wrap } from '../src/refs'

test('inversion and reversion cancel out', () => {
  /* Reference Type */
  const scalar: IntrospectionNamedTypeRef = { kind: 'SCALAR', name: 'ID' }
  const ref: IntrospectionTypeRef = {
    kind: 'NON_NULL',
    ofType: {
      kind: 'LIST',
      ofType: scalar,
    },
  }

  /* Test */
  expect(wrap('string', ref)).toEqual('((string | null)[])')
})
