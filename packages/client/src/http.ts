import { fetch } from 'cross-fetch'

import { OperationType, serialize } from './document'
import * as error from './error'
import { GraphQLResponse, GraphQLError } from './response'
import { SelectionSet } from './selection'
import { defined } from './utils'

/* Internal */

export interface PerformInput<TypeLock, Type> {
  endpoint: string
  /**
   * Selection of fields.
   */
  selection: SelectionSet<TypeLock, Type>
  /**
   * Tells whether it's a query or a mutation.
   */
  operation: OperationType
  operationName?: string
  /**
   * Dictionary of key-value pairs that we should use as headers.
   */
  headers?: { [key: string]: string }
}

export type PerformOutput<Type> = [Type] | [null | Type, error.RequestError]

/**
 * Performs a request against the server.
 *
 * NOTE: This function is only used internally as the ground for query and mutation send
 *       functions defined above.
 */
export async function perform<TypeLock, Type>(
  opts: PerformInput<TypeLock, Type>,
): Promise<PerformOutput<Type>> {
  /* Construct a request. */
  const query = serialize({
    fields: opts.selection.fields,
    operationType: opts.operation,
    operationName: opts.operationName,
  })

  /**
   * We get all arguments from the selection and
   * add identify them using their hashes in the
   * variables parameter of the object.
   */
  const args = opts.selection.fields.flatMap((f) => f.arguments)

  let variables: { [hash: string]: any } = {}
  for (const arg of args) {
    if (defined(arg.value)) {
      variables[arg.alias] = arg.value
    }
  }

  const body: { [key: string]: any } = {
    query,
    variables,
  }

  /**
   * Add operationName parameter if it's present.
   */
  if (opts.operationName) {
    body['operationName'] = opts.operationName
  }

  /**
   * We perform request using standard fetch library.
   * If any errors occur during execution we return them as
   */

  try {
    const res = await fetch(opts.endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers,
      },
    })

    /**
     * Check that we got 200 OK status.
     */
    if (res.status !== 200) {
      return [null, error.badstatus(res.status)]
    }

    /**
     * Decode data using provided decoder. We assume that
     * any error thrown while decoding is a badpayload error.
     *
     * Even if the result contains GraphQL errors,
     * we should be able to decode the result. TypeLock should always
     * reflect all possible scenarios.
     */
    try {
      const { data, errors }: GraphQLResponse<TypeLock> = await res.json()
      const result = opts.selection.decode(data)

      if (errors && errors.length > 0) {
        return [result, error.graphql(errors)]
      }

      return [result]
    } catch (err) {
      return [null, error.badpayload(err.message)]
    }
  } catch (err) {
    /**
     * Catch all case that defaults to network error.
     */
    return [null, error.network(err)]
  }
}
