import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import {
  GQLGenerator,
  loadSchemaFromPath,
  loadSchemaFromURL,
} from 'ts-graphql-codegen/src'

import { defined } from '../src/utils'

const writefile = promisify(fs.writeFile)
const prettier = require('../../../prettier.config')

/* Configuration */

const ENDPOINT = 'http://localhost:4000/graphql'
const FIXTURES = path.resolve(__dirname, '../tests/__fixtures__')

const SCHEMA_PATH = path.resolve(FIXTURES, './schema.json')
const API_PATH = path.resolve(FIXTURES, './api.ts')

const CORE_PATH = path.resolve(__dirname, '../src/')
const CODECS_PATH = path.resolve(FIXTURES, './codecs')

export default async () => {
  let schema: IntrospectionSchema | undefined = undefined

  /**
   * We load the schema from the server if server is available,
   * otherwise we use the cached result from fixtures.
   *
   * We save the generated code into a fixtures file for examination
   * and compare its content with the generated code using snapshots.
   */
  try {
    schema = await loadSchemaFromURL(ENDPOINT)
    await writefile(SCHEMA_PATH, JSON.stringify(schema, null, 2))
  } catch (err) {
    schema = await loadSchemaFromPath(SCHEMA_PATH)
  } finally {
    if (!defined(schema)) throw new Error(`Couldn't load schema.`)
  }

  /**
   * Construct the generator.
   */
  const generator = new GQLGenerator(schema, prettier)

  /**
   * Save the code and perform tests as described above.
   */
  const code = generator.generate({
    core: path.relative(FIXTURES, CORE_PATH),
    codecs: CODECS_PATH,
  })
  await writefile(API_PATH, code)

  console.log(`API generated!`)
}
