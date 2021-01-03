import { fetch } from 'cross-fetch'

import { OperationType, serialize } from './document'
import { hash } from './document/argument'
import { argumentsOfFields } from './document/field'
import { Fields, SelectionSet } from './selection'
import { defined } from './utils'

interface SendInput<TypeLock, Type> {
  endpoint: string
  /**
   * Selection of fields.
   */
  selection: SelectionSet<TypeLock, Type>
  /**
   * Tells whether it's a query or a mutation.
   */
  operationName?: string
  /**
   * HTTP method used to send the request. Defaults to POST>
   */
  method?: HttpMethod
  /**
   * Dictionary of key-value pairs that we should use as headers.
   */
  headers?: HttpHeaders
}

/**
 * Executes a query against the endpoint.
 */
export async function send<TypeLock, Type>(
  opts: SendInput<TypeLock, Type>,
): Promise<Type> {
  return perform({
    operation: OperationType.Query,
    ...opts,
  })
}

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
  headers?: HttpHeaders
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
  const query = serialize({
    fields: opts.selection.fields,
    operationType: opts.operation,
    operationName: opts.operationName,
  })

  let variables: { [hash: string]: any } = {}
  for (const arg of argumentsOfFields(opts.selection.fields)) {
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
  }).then((res) => res.json())

  /* Decode the result. */
  // TODO: not exactly correct...
  const data = opts.selection.decode(res)

  return data
}
