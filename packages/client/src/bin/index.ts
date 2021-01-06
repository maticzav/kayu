#!/usr/bin/env node

import * as fs from 'fs'
import { IntrospectionSchema } from 'graphql'
import * as path from 'path'
import { promisify } from 'util'

import {
  GQLGenerator,
  loadSchemaFromPath,
  loadSchemaFromURL,
  loadSchemaFromSDL,
} from '@kayu/codegen'

import { isURL } from '../utils'

/* Utils */

const writefile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)

/* Configuration */

const DEFAULT_CONFIG = (root: string) => `
module.exports = {
  endpoint: "http://localhost:3000",
  schema: "./schema.json",
  api: "./api.ts",
  // prettier: undefined
}
`

/* Types */

export type Config = {
  /**
   * GraphQL server endpoint.
   */
  endpoint: string
  /**
   * Path to output file relative to this file.
   */
  api: string
  /**
   * Path to codecs declaration relative to this file.
   */
  codecs?: string
  /**
   * Path to schema cache relative to this file.
   */
  schema: string
  /**
   * Optional path to prettier.config.js path relative to this file.
   */
  prettier?: string
}

/**
 * Handles generation of configuration.
 */
export async function generate(root: string) {
  /**
   * Calculate the config path based on the root.
   */
  const configpath = path.resolve(root, './kayu.config.js')

  let config: Config

  try {
    config = require(configpath)
  } catch (err) {
    console.log(`Coudln't find configuration.`)
    await writefile(configpath, DEFAULT_CONFIG(root))
    console.log(`We have scaffolded config file to ${configpath}.`)
    process.exit(0)
  }

  /**
   * Create boilerplate configuration file.
   */

  /**
   * We calculate output paths.
   */

  const ENDPOINT = config.endpoint
  const CORE_PATH = '@kayu/client'
  const API_PATH = path.resolve(root, config.api)
  const API_DIR = path.dirname(API_PATH)
  const SCHEMA_PATH = path.resolve(root, config.schema)

  // Optional args
  let CODECS_PATH: string | undefined = undefined
  let PRETTIER: object = {}

  if (config.prettier) {
    const PRETTIER_PATH = path.resolve(root, config.prettier)
    try {
      PRETTIER = require(PRETTIER_PATH)
    } catch (err) {
      console.log(`Couldn't find prettier.config.js in ${PRETTIER_PATH}.`)
      process.exit(1)
    }
  }
  if (config.codecs) {
    /**
     * We calculate codecs path relative to the output directory.
     * This way, code stays the same when ran on a CI.
     */
    const absoluteCodecsPath = path.resolve(root, config.codecs)
    const relativeCodecsPath = path.relative(API_DIR, absoluteCodecsPath)

    CODECS_PATH = `./${relativeCodecsPath}`
  }

  /**
   * We load the schema from the server if url is an address
   * and server is available or SDL file if given file is an SDL,
   * otherwise we use the cached result.
   */
  let schema: IntrospectionSchema | undefined = undefined

  try {
    // SDL load
    if (ENDPOINT.endsWith('.graphql') || ENDPOINT.endsWith('.gql')) {
      const sdlPath = path.resolve(root, config.endpoint)
      schema = await loadSchemaFromSDL(sdlPath)
    }
    // URL load
    if (isURL(ENDPOINT)) {
      schema = await loadSchemaFromURL(ENDPOINT)
    }
  } catch (err) {
    schema = await loadSchemaFromPath(SCHEMA_PATH)
  } finally {
    if (schema === undefined) {
      console.error(`Couldn't load schema from ${ENDPOINT}.`)
      process.exit(1)
    }
    await writefile(SCHEMA_PATH, JSON.stringify(schema, null, 2))
  }

  /**
   * Construct the generator.
   */
  const generator = new GQLGenerator(schema, PRETTIER)

  /**
   * Save the code and perform tests as described above.
   */
  const code = generator.generate({
    core: CORE_PATH,
    codecs: CODECS_PATH?.replace(/\.ts$/, ''),
  })
  await writefile(API_PATH, code)

  console.log(`API generated!`)
}

/* Main */

async function main() {
  /**
   * We calculate endpoint relative to configuration file.
   */
  const cwd = process.env.INIT_CWD || process.cwd()

  const root = await pkg(cwd)

  /* istanbul ignore if */
  if (root === null) {
    console.log(`Couldn't find root folder of your project.`)
    process.exit(1)
  }

  generate(root)
}

/**
 * Run the script when we run this file.
 */
if (require.main === module) {
  main()
}

/* Utility functions */

/**
 * Tries to find the first package.json up the way. We use it
 * as a relative cornerstone for calculating paths.
 */
export async function pkg(cwd: string): Promise<string | null> {
  let currentPath: string = cwd

  /**
   * We iterate over the path until we either find package.json
   * or reach root.
   */
  while (currentPath !== '/') {
    const files = await readdir(currentPath)

    if (files.some((file) => file === 'package.json')) {
      return currentPath
    }
  }

  /* istanbul ignore next */
  return null
}
