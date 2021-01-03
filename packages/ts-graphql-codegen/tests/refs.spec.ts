import { IntrospectionNamedTypeRef, IntrospectionTypeRef } from 'graphql'

import { wrap, wrapGraphQLSDL } from '../src/refs'

test('generates correct TS types from ref', () => {
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
  expect(wrap('string', ref)).toEqual('Array<string | null>')
  expect(wrap('string', ref, true)).toEqual('Array<string | null | undefined>')
})

test('generates correct GraphQL SDL types from ref', () => {
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
  expect(wrapGraphQLSDL(scalar.name, ref)).toEqual('[ID]!')
})
