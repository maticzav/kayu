import * as express from 'express'
import { Server } from 'http'
import * as path from 'path'

import { apollo } from '../../../server/src'

import { loadSchemaFromPath, loadSchemaFromURL } from '../src'
import { loadSchemaFromSDL } from '../src/schema'

/* Configuration */

const PORT = 4444
const FIXTURES = path.resolve(__dirname, './__fixtures__')

/* Tests */

describe('schema', () => {
  let url = `http://localhost:${PORT}/graphql`
  let server: Server

  /**
   * We first start the server.
   */
  beforeAll(async () => {
    const app = express()
    apollo.applyMiddleware({ app })
    server = app.listen(PORT)
  })

  /**
   * We finish by shutting down the server.
   */
  afterAll(async () => {
    server.close()
  })

  test('loads from GraphQL SDL', async () => {
    const sdl = path.resolve(FIXTURES, './schema.graphql')
    const schema = await loadSchemaFromSDL(sdl)

    console.log({ schema })

    expect(schema).toMatchSnapshot()
  })

  test('loads from GraphQL endpoint', async () => {
    const schema = await loadSchemaFromURL(url)

    expect(schema).toMatchSnapshot()
  })
})
