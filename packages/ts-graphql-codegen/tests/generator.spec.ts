import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import { GQLGenerator, loadSchemaFromPath, loadSchemaFromURL } from '../src'
import { defined } from '../src/utils'

const writefile = promisify(fs.writeFile)
const prettier = require('../../../prettier.config')

/* Configuration */

const ENDPOINT = 'http://localhost:4000/graphql'
const SCHEMA_PATH = path.resolve(__dirname, './__fixtures__/schema.json')
const API_PATH = path.resolve(__dirname, './__fixtures__/api.ts')
const CORE_PATH = path.resolve(__dirname, '../../ts-graphql/src/__generator')

describe('generator', () => {
  test('generates the API', async () => {
    /**
     * We load the schema from the server if server is available,
     * otherwise we use the cached result from fixtures.
     *
     * We save the generated code into a fixtures file for examination
     * and compare its content with the generated code using snapshots.
     */

    /**
     * Load the schema.
     */
    let schema: IntrospectionSchema | undefined = undefined

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
    const scalars = new Map()
    const generator = new GQLGenerator(schema, scalars, prettier)

    /**
     * Save the code and perform tests as described above.
     */
    const code = generator.generate(path.relative(__dirname, CORE_PATH))
    await writefile(API_PATH, code)

    expect(code).toMatchSnapshot()
  })
})
