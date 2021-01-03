import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import { OperationType, serialize } from '../../ts-graphql/src/document'

import { GQLGenerator, loadSchemaFromPath, loadSchemaFromURL } from '../src'
import { defined } from '../src/utils'

import * as api from './__fixtures__/api'

const writefile = promisify(fs.writeFile)
const prettier = require('../../../prettier.config')

/* Configuration */

const ENDPOINT = 'http://localhost:4000/graphql'
const SCHEMA_PATH = path.resolve(__dirname, './__fixtures__/schema.json')
const FIXTURES = path.resolve(__dirname, './__fixtures__')
const API_PATH = path.resolve(FIXTURES, './api.ts')
const CORE_PATH = path.resolve(__dirname, '../../ts-graphql/src/__generator')

/* Documentation */

describe('generator', () => {
  let schema: IntrospectionSchema

  beforeAll(async () => {
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
  })

  test('generates the API', async () => {
    /**
     * Construct the generator.
     */
    const scalars = new Map()
    const generator = new GQLGenerator(schema, scalars, prettier)

    /**
     * Save the code and perform tests as described above.
     */
    const code = generator.generate(path.relative(FIXTURES, CORE_PATH))
    await writefile(API_PATH, code)

    expect(code).toMatchSnapshot()
  })

  test('tests the API', () => {
    // const api = require('./__fixtures__/api')

    const pg_human = api.objects.human((t) => {
      let id = t.id()
      let name = t.name()

      return { id, name }
    })

    const pg = api.objects.query((t) => {
      let human = t.human({ id: '1000' })(pg_human.nullable)
      return `${human.name}`
    })

    expect(
      serialize({
        fields: pg.fields,
        operationType: OperationType.Query,
      }),
    ).toMatchSnapshot()
  })
})
