import ml from 'multilines'

import { OperationType, serialize } from '../src/document'
import { arg } from '../src/document/argument'
import { composite, fragment, leaf } from '../src/document/field'

describe('serialization', () => {
  test('single leaf', () => {
    /* Document */

    const document = [leaf('fruit')]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        fruit_c214d170d7fff31dc574bfb3b1dd3708: fruit
      }"
    `)
  })

  test('multiple leaves', () => {
    /* Document */

    const document = [leaf('fruit'), leaf('chocolate'), leaf('icecream')]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        fruit_c214d170d7fff31dc574bfb3b1dd3708: fruit
        chocolate_6a8fb58342ea086a9725cb14b37188b3: chocolate
        icecream_6fcc3285e303b05da30860cca1d54c41: icecream
      }"
    `)
  })

  test('composite', () => {
    /* Document */

    const document = [composite('cart', [leaf('apples'), leaf('oranges')])]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        cart_f1121066f9af52952dc410428cee3f81: cart {
          __typename
          apples_5ca9b46de141a9c8dccc9e54d681b552: apples
          oranges_f1b333568cdfe686622a262fac2e8221: oranges
        }
      }"
    `)
  })

  test('fragment', () => {
    /* Document */

    const document = [fragment('Cart', [leaf('apples'), leaf('oranges')])]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        ... on Cart {
          __typename
          apples_5ca9b46de141a9c8dccc9e54d681b552: apples
          oranges_f1b333568cdfe686622a262fac2e8221: oranges
        }
      }"
    `)
  })

  /* Operation name */
  test('operation name', () => {
    /* Document */

    const document = [leaf('fruit')]

    expect(
      serialize({
        operationName: 'Query',
        operationType: OperationType.Query,
        fields: document,
      }),
    ).toMatchInlineSnapshot(`
      "query Query {
        fruit_c214d170d7fff31dc574bfb3b1dd3708: fruit
      }"
    `)
  })

  /* Arguments */

  test('arguments on leaf', () => {
    /* Document */

    const document = [
      leaf(
        'fruit',
        /* Arguments */
        [arg('color', 'String!', 'red'), arg('name', 'String')],
      ),
    ]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query ($_d1516317d6fcf60605b4ce18ca2851f5: String!) {
        fruit_979d4ce64cdde422e45a454e0c833815: fruit(color: $_d1516317d6fcf60605b4ce18ca2851f5)
      }"
    `)
  })

  test('arguments on composite', () => {
    /* Document */

    const document = [
      composite(
        'cart',
        /* Selection */
        [leaf('apples'), leaf('oranges')],
        /* Arguments */
        [arg('color', 'String!', 'red'), arg('name', 'String')],
      ),
    ]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query ($_d1516317d6fcf60605b4ce18ca2851f5: String!) {
        cart_91c6bc3c9f86854e37b166704fb420fb: cart(color: $_d1516317d6fcf60605b4ce18ca2851f5) {
          __typename
          apples_5ca9b46de141a9c8dccc9e54d681b552: apples
          oranges_f1b333568cdfe686622a262fac2e8221: oranges
        }
      }"
    `)
  })
})
