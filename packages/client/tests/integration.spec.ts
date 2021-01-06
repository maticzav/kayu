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
    /* Selections */
    const human = api.objects.human((t) => {
      let id = t.id()
      let name = t.name()
      let appearsIn = t.appearsIn()

      return {
        id,
        name,
        note: `Plays ${appearsIn}.`,
      }
    })

    const droid = api.objects.droid((t) => {
      let id = t.id()
      let name = t.name()
      let primary = t.primaryFunction()

      return {
        id,
        name,
        note: `My primary function is ${primary}.`,
      }
    })

    const character = api.interfaces.character((t) => {
      const char = t.on({
        droid: droid,
        human: human,
      })

      return char
    })

    const union = api.unions.characterUnion((t) => {
      const char = t.on({
        droid: droid,
        human: human,
      })

      return char
    })

    const query = api.objects.query((t) => {
      let greeting = t.greeting({
        input: { name: 'Matic', language: api.Enum.Language.EN },
      })
      let humans = t.humans(human.list)
      let chars = t.characters(character.list)
      let char = t.character({ id: '1000' })(union.nullable)

      return { humans, chars, greeting }
    })

    const res = await api.send({
      endpoint: url,
      selection: query,
    })

    expect(res).toMatchSnapshot()
  })
})
