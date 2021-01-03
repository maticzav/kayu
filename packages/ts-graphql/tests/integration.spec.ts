import { serialize, OperationType } from '../src/document'
import * as api from './__fixtures__/api'

describe('integration', () => {
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
