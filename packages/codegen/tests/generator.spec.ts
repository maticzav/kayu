import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import { GQLGenerator } from '../src/generator'
import { loadSchemaFromPath } from '../src/schema'

const writefile = promisify(fs.writeFile)
const prettier = require('../../../prettier.config')

/* Configuration */

const ENDPOINT = 'http://localhost:4000/graphql'

const FIXTURES = path.resolve(__dirname, './__fixtures__')
const SCHEMA_PATH = path.resolve(FIXTURES, './schema.json')

const CODECS_PATH = path.resolve(FIXTURES, './codecs')
const CORE_PATH = path.resolve(__dirname, '../../client/src/')

/* Documentation */

describe('generator', () => {
  let schema: IntrospectionSchema

  beforeAll(async () => {
    schema = await loadSchemaFromPath(SCHEMA_PATH)
  })

  test('generates the API with codecs', async () => {
    /**
     * Construct the generator.
     */
    const generator = new GQLGenerator(schema, prettier)

    /**
     * Save the code and perform tests as described above.
     */
    const code = generator.generate({
      core: path.relative(FIXTURES, CORE_PATH),
      codecs: `./${path.relative(FIXTURES, CODECS_PATH)}`,
    })
    await writefile(path.resolve(FIXTURES, './api-codecs.ts'), code)

    expect(code).toMatchSnapshot()
  })

  test('generates the API without codecs', async () => {
    /**
     * Construct the generator.
     */
    const generator = new GQLGenerator(schema, prettier)

    /**
     * Save the code and perform tests as described above.
     */
    const code = generator.generate({
      core: path.relative(FIXTURES, CORE_PATH),
    })
    await writefile(path.resolve(FIXTURES, './api-nocodecs.ts'), code)

    expect(code).toMatchSnapshot()
  })
})
