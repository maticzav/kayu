import * as fs from 'fs'
import {
  getIntrospectionQuery,
  IntrospectionQuery,
  IntrospectionSchema,
} from 'graphql'
import fetch from 'node-fetch'
import * as path from 'path'
import { promisify } from 'util'

const readfile = promisify(fs.readFile)

export type LoadSchemaFromOptions = {
  /**
   * Dictionary of headers where key represents header name
   * and value represents header value.
   */
  headers?: { [key: string]: string }
  /**
   * The method used to perform the request.
   */
  method?: 'POST' | 'GET'
}

/**
 * Loads introspection schema that we use to generate the library
 * from a specified endpoint.
 *
 * We assume that return value is correct and don't check it
 * beyond making it conform to type.
 */
export async function loadSchemaFromURL(
  endpoint: string,
  opts?: LoadSchemaFromOptions,
): Promise<IntrospectionSchema> {
  /* Construct request. */
  const body = {
    query: getIntrospectionQuery(),
  }

  /* Fetch the response */
  const res = await fetch(endpoint, {
    body: JSON.stringify(body),
    headers: opts?.headers,
    method: opts?.method,
  })

  const query: IntrospectionQuery = await res.json()
  return query.__schema
}

/**
 * Loads the schema from local file path. Path should be given as a
 * global - you may use `path` module to get it.
 *
 * We assume that file content is correct and perform no deep checks
 * on type signature of the file.
 */
export async function loadSchemaFromPath(
  filepath: string,
): Promise<IntrospectionSchema> {
  /* Check that path is absolute. */
  if (!path.isAbsolute(filepath)) {
    throw new Error(`Expected absolute path, but got ${filepath}.`)
  }

  /* Laod the data. */
  const data = await readfile(filepath)
  const schema: IntrospectionSchema = JSON.parse(data.toString())

  return schema
}
