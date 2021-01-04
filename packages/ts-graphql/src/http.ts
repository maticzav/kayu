import { fetch } from 'cross-fetch'

import { OperationType, serialize } from './document'
import { SelectionSet } from './selection'
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
   * Dictionary of key-value pairs that we should use as headers.
   */
  headers?: HttpHeaders
}

/**
 * Executes a query against the endpoint.
 */
export async function query<TypeLock, Type>(
  opts: SendInput<TypeLock, Type>,
): Promise<[Type] | [null, Error]> {
  return perform({
    operation: OperationType.Query,
    ...opts,
  })
}

/**
 * Run a mutation on the server using selection.
 */
export async function mutate<TypeLock, Type>(
  opts: SendInput<TypeLock, Type>,
): Promise<[Type] | [null, Error]> {
  return perform({
    operation: OperationType.Mutation,
    ...opts,
  })
}

export type HttpHeaders = { [key: string]: string }

/* Internal */

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
): Promise<[Type] | [null, Error]> {
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

  /* Perform a request. */

  try {
    const res: GraphQLResponse<TypeLock> = await fetch(opts.endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...opts.headers,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    /* Decode the result. */
    const data = opts.selection.decode(res.data)

    return [data]
  } catch (err) {
    return [null, err]
  }
}
