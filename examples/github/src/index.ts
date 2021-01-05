import { objects, send } from './api'

/* Configuration */

const GH_TOKEN = process.env.GH_TOKEN

/* Github Example */

async function main() {
  /**
   * We create a selection.
   */
  const user = objects.user((t) => ({
    id: t.id(),
    name: t.name(),
  }))

  const query = objects.query((t) => {
    const viewer = t.viewer(user)
    return { viewer }
  })

  /**
   * We send a query to the endpoint.
   */
  const [res] = await send({
    endpoint: 'https://api.github.com/graphql',
    selection: query,
    headers: {
      Authorization: `bearer ${GH_TOKEN}`,
    },
  })

  console.log(`Your name is ${res?.viewer.name}`)
}

if (require.main === module) {
  main()
}
