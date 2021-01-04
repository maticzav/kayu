import * as express from 'express'
import { Server } from 'http'

import { apollo } from '../../../server/src'

import * as api from './__fixtures__/api'

/* Config */

const PORT = 4321

/* Tests */

describe('integration', () => {
  /* State */

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

  /**
   * Tests fleet.
   */
  test('tests the API', async () => {
    const pg_human = api.objects.human((t) => {
      let id = t.id()
      let name = t.name()
      let appearsIn = t.appearsIn()

      return { id, name, appearsIn }
    })

    const pg = api.objects.query((t) => {
      let human = t.human({ id: '1000' })(pg_human.nullable)
      return { human }
    })

    const res = await api.send({
      endpoint: url,
      selection: pg,
    })

    expect(res).toMatchSnapshot()
  })
})
