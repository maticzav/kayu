import { objects, send } from './api'

async function main() {
  /**
   * We create a selection.
   */
  const human = objects.human((t) => ({
    id: t.id(),
    name: t.name(),
    home: t.homePlanet(),
  }))

  const query = objects.query((t) => {
    const luke = t.luke(human.nullable)

    return { luke }
  })

  /**
   * We send a query to the endpoint.
   */
  const [res] = await send({
    endpoint: '',
    selection: query,
  })

  console.log(res)
}

if (require.main === module) {
  main()
}
