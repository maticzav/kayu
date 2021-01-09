import { GraphQLError } from './response'

/**
 * Represents an error in the request. Every possible error
 * is represented as one of these types.
 */
export type RequestError =
  | { kind: 'graphql'; errors: GraphQLError[] }
  | { kind: 'http'; type: 'badpayload'; message: string }
  | { kind: 'http'; type: 'badstatus'; status: number }
  | { kind: 'http'; type: 'network'; error: Error }

/* Utility functions */

/**
 * Utility function that creates GraphQL error.
 */
export function graphql(errors: GraphQLError[]): RequestError {
  return { kind: 'graphql', errors }
}

/**
 * Utility function that creates badpayload error.
 */
export function badpayload(message: string): RequestError {
  return { kind: 'http', type: 'badpayload', message }
}

/**
 * Utility function that creates badpayload error.
 */
export function badstatus(status: number): RequestError {
  return { kind: 'http', type: 'badstatus', status }
}

/**
 * Utility function that creates network error.
 */
export function network(error: Error): RequestError {
  return { kind: 'http', type: 'network', error }
}
