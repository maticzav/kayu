import { fetch } from 'cross-fetch'

import { OperationType, serialize } from './document'
import { hash } from './document/argument'
import { argumentsOfFields } from './document/field'
import { Fields, SelectionSet } from './selection'
import { defined } from './utils'

/**
 * Executes a query against the endpoint.
 */
// export async function send<TypeLock, Type>(opts: {
//   selection: SelectionSet<TypeLock, Type>
//   operation: OperationType
//   operationName?: string
//   endpoint: string
//   method: HttpMethod
//   headers: HttpHeaders
// }): Promise<Type> {
//   return perform({
//     endpoint,
//   })
// }

export type HttpHeaders = { [key: string]: string }
export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
}

interface PerformInput<TypeLock, Type> {
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
   * HTTP method used to send the request. Defaults to POST>
   */
  method?: HttpMethod
  /**
   * Dictionary of key-value pairs that we should use as headers.
   */
  headers: HttpHeaders
}

/**
 * Performs a request against the server.
 *
 * NOTE: This function is only used internally as the ground for query and mutation send
 *       functions defined above.
 */
async function perform<TypeLock, Type>(
  opts: PerformInput<TypeLock, Type>,
): Promise<Type> {
  /* Construct a request. */
  let fields = new Fields<TypeLock>()
  opts.selection.decoder(fields)

  const query = serialize({
    fields: fields.selection,
    operationType: opts.operation,
    operationName: opts.operationName,
  })

  let variables: { [hash: string]: any } = {}
  for (const arg of argumentsOfFields(fields.selection)) {
    if (defined(arg.value)) {
      variables[hash([arg])] = arg.value
    }
  }

  const body: { [key: string]: any } = {
    query,
    variables,
  }

  if (opts.operationName) {
    body['operationName'] = opts.operationName
  }

  /* Perform a request. */
  const res = await fetch(opts.endpoint, {
    method: opts.method || 'POST',
    body: JSON.stringify(body),
    headers: {
      ...opts.headers,
      'Content-Type': 'application/json',
    },
  })

  /* Decode the result. */
  const data = await res.json()
  const fieldsWithData = new Fields<TypeLock>(data)

  return opts.selection.decoder(fieldsWithData)
}
