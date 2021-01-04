/**
 * Represents a response we get from the server.
 */
type GraphQLResponse<TypeLock> = {
  data: TypeLock
  errors?: GraphQLError[]
}

/**
 * Represents an error in execution that might be included in the
 * response type.
 */
type GraphQLError = {
  message: string
  locations?: {
    line: number
    column: number
  }[]
}
