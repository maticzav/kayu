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
        fruit_eb37e7ab6887e55aeb7f98d695100103: fruit
      }"
    `)
  })

  test('multiple leaves', () => {
    /* Document */

    const document = [leaf('fruit'), leaf('chocolate'), leaf('icecream')]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        fruit_eb37e7ab6887e55aeb7f98d695100103: fruit
        chocolate_3300c1bdd6a08dadf2af76dc6d516569: chocolate
        icecream_9b912fdc4321963d056e662b3c117fbf: icecream
      }"
    `)
  })

  test('composite', () => {
    /* Document */

    const document = [composite('cart', [leaf('apples'), leaf('oranges')])]

    expect(serialize({ operationType: OperationType.Query, fields: document }))
      .toMatchInlineSnapshot(`
      "query {
        cart_416de9e4af9665f3320aa9c40f58366a: cart {
          __typename
          apples_8f1252cf10c1a604dfd555bb7a5c0e64: apples
          oranges_f16340c1fecde79ece24e1aa36a837ba: oranges
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
          apples_8f1252cf10c1a604dfd555bb7a5c0e64: apples
          oranges_f16340c1fecde79ece24e1aa36a837ba: oranges
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
        fruit_eb37e7ab6887e55aeb7f98d695100103: fruit
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
        fruit_2489b25c35405165a5e714afb49c1007: fruit(color: $_d1516317d6fcf60605b4ce18ca2851f5)
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
        cart_225b4c586e6a13e4a81b15f31567bc65: cart(color: $_d1516317d6fcf60605b4ce18ca2851f5) {
          __typename
          apples_8f1252cf10c1a604dfd555bb7a5c0e64: apples
          oranges_f16340c1fecde79ece24e1aa36a837ba: oranges
        }
      }"
    `)
  })
})
