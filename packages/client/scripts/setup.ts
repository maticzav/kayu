import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import { GQLGenerator, loadSchemaFromPath } from '@kayu/codegen'

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
  let schema: IntrospectionSchema = await loadSchemaFromPath(SCHEMA_PATH)

  /**
   * Construct the generator.
   */
  const generator = new GQLGenerator(schema, prettier)

  /**
   * Save the code and perform tests as described above.
   */
  const code = generator.generate({
    core: `./${path.relative(FIXTURES, CORE_PATH)}`,
    codecs: `./${path.relative(FIXTURES, CODECS_PATH)}`,
  })
  await writefile(API_PATH, code)

  console.log(`API generated!`)
}
