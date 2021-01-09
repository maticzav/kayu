/**
 * Represents a response we get from the server.
 */
export type GraphQLResponse<TypeLock> = {
  data: TypeLock
  errors?: GraphQLError[]
}

/**
 * Represents an error in execution that might be included in the
 * response type.
 */
export type GraphQLError = {
  message: string
  locations?: {
    line: number
    column: number
  }[]
}
