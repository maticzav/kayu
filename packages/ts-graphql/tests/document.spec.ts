import ml from 'multilines'

import { OperationType, serialize } from '../src/document'
import { arg } from '../src/document/argument'
import { composite, fragment, leaf } from '../src/document/field'

describe('serialization', () => {
  test('single leaf', () => {
    /* Document */

    const document = [leaf('fruit')]
    const expected = ml`
    | query {
    |   fruit_1239eb4a8416af46c0448426b51771f5: fruit
    | }
    `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
  })

  test('multiple leaves', () => {
    /* Document */

    const document = [leaf('fruit'), leaf('chocolate'), leaf('icecream')]
    const expected = ml`
    | query {
    |   fruit_1239eb4a8416af46c0448426b51771f5: fruit
    |   chocolate_1239eb4a8416af46c0448426b51771f5: chocolate
    |   icecream_1239eb4a8416af46c0448426b51771f5: icecream
    | }
    `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
  })

  test('composite', () => {
    /* Document */

    const document = [composite('cart', [leaf('apples'), leaf('oranges')])]
    const expected = ml`
    | query {
    |   cart_1239eb4a8416af46c0448426b51771f5: cart {
    |     __typename
    |     apples_1239eb4a8416af46c0448426b51771f5: apples
    |     oranges_1239eb4a8416af46c0448426b51771f5: oranges
    |   }
    | }
    `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
  })

  test('fragment', () => {
    /* Document */

    const document = [fragment('Cart', [leaf('apples'), leaf('oranges')])]
    const expected = ml`
    | query {
    |   ... on Cart {
    |     __typename
    |     apples_1239eb4a8416af46c0448426b51771f5: apples
    |     oranges_1239eb4a8416af46c0448426b51771f5: oranges
    |   }
    | }
      `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
  })

  /* Operation name */
  test('operation name', () => {
    /* Document */

    const document = [leaf('fruit')]
    const expected = ml`
        | query Query {
        |   fruit_1239eb4a8416af46c0448426b51771f5: fruit
        | }
        `

    expect(
      serialize({
        operationName: 'Query',
        operationType: OperationType.Query,
        fields: document,
      }),
    ).toEqual(expected)
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
    const expected = ml`
    | query ($bc654bdce94ead15d7dea7b509237d77: String!) {
    |   fruit_972dff40811115ed68bf327b76b818b4: fruit(color: $bc654bdce94ead15d7dea7b509237d77)
    | }
    `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
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
    const expected = ml`
    | query ($bc654bdce94ead15d7dea7b509237d77: String!) {
    |   cart_972dff40811115ed68bf327b76b818b4: cart(color: $bc654bdce94ead15d7dea7b509237d77) {
    |     __typename
    |     apples_1239eb4a8416af46c0448426b51771f5: apples
    |     oranges_1239eb4a8416af46c0448426b51771f5: oranges
    |   }
    | }
    `

    expect(
      serialize({ operationType: OperationType.Query, fields: document }),
    ).toEqual(expected)
  })
})
