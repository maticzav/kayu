import { hash } from './document/argument'
import { alias, argumentsOfFields, Field } from './document/field'
import { indent, defined } from './utils'

export enum OperationType {
  Query = 'query',
  Mutation = 'mutation',
}

export type SerializeInput = {
  operationType: OperationType
  fields: Field[]
  operationName?: string
}

/**
 * Serializes an operation into a GraphQL SDL.
 */
export function serialize({
  operationType,
  fields,
  operationName,
}: SerializeInput): string {
  /**
   * Get all the arguments in a fields' tree and join them in a single
   * declaration for operation definition. We first get all the arguments,
   * then filter out the ones without value, and parse the remaining ones.
   */
  let args: string | undefined = undefined

  const serializedArgs = argumentsOfFields(fields)
    .filter((arg) => defined(arg.value))
    .map((arg) => `$${hash([arg])}: ${arg.type}`)

  if (serializedArgs.length > 0) {
    args = `(${serializedArgs.join(', ')})`
  }

  /**
   * Construct operation definition by filtering out the parts
   * that may be empty and joining them.
   */
  const operationDefinition = [operationType, operationName, args]
    .filter<string>(defined)
    .join(' ')

  /**
   * Construct the query using given data.
   */
  const query: string[] = [
    `${operationDefinition} {`,
    ...fields.flatMap(serializeField).map(indent(2)),
    `}`,
  ]
  return query.join('\n')
}

/**
 * Serializes a single field.
 */
export function serializeField(field: Field): string[] {
  switch (field.kind) {
    /* Leaf */
    case 'leaf': {
      /**
       * We check that a field has an argument and append all of those arguments if
       * they are specified.
       */
      let args: string = ''
      const argsWithValue = field.arguments
        .filter((arg) => defined(arg.value))
        .map((arg) => `${arg.name}: $${hash([arg])}`)

      if (argsWithValue.length > 0) {
        args = `(${argsWithValue.join(',')})`
      }

      return [`${alias(field)!}: ${field.name}${args}`]
    }
    /* Composite */
    case 'composite': {
      let args: string = ''
      const argsWithValue = field.arguments
        .filter((arg) => defined(arg.value))
        .map((arg) => `${arg.name}: $${hash([arg])}`)

      if (argsWithValue.length > 0) {
        args = `(${argsWithValue.join(',')})`
      }

      return [
        `${alias(field)!}: ${field.name}${args} {`,
        indent(2)('__typename'),
        ...field.selection.flatMap(serializeField).map(indent(2)),
        `}`,
      ]
    }
    /* Fragment */
    case 'fragment': {
      return [
        `... on ${field.type} {`,
        indent(2)('__typename'),
        ...field.selection.flatMap(serializeField).map(indent(2)),
        `}`,
      ]
    }
  }
}
