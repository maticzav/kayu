import { Field } from './document/field'
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

  const serializedArgs = fields
    .flatMap((f) => f.arguments)
    .filter((arg) => defined(arg.value))
    .map((arg) => `$${arg.alias}: ${arg.type}`)

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
    ...fields.flatMap((f) => f.serialize()).map(indent(2)),
    `}`,
  ]
  return query.join('\n')
}
