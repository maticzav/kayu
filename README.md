# ts-graphql

- make strict type inferences - use null when appropriate
- object is the same as structure in Swift - roughly
- have auto running postscript + cli utility to fetch schema and save it

## Configuration

```yml
endpoint: path_to_local_schema | url
output: local_path | node_modules default
```

## Code

```ts
import * as gql from 'ts-graphql'
import { objects, o } from 'ts-graphql'

const human: string = objects.human((t) => {
  var firstname = t.firstname()
  var lastname = t.lastname()

  if firstname.startwith("M") {
    throw new Error("Not an M!!!")
  }

  return `${firstname} ${lastname}`
})

/* Queries */

const humansQuery: Selection<Query><string[]> = objects.query((t) => ({
  humans: t.humans(human.list),
}))

const searchQuery = o.query((t) =>
  t.search({ query: 'ts-graphql' })(
    o.search((s) => {
      return {
        id: s.id(),
        name: s.name(),
      }
    }).list,
  ),
)

const [result, error] = await gql.fetch(selection)
```

---

```ts
import * as gql from 'ts-graphql'
import { objects, o } from 'ts-graphql'

const human: string = objects.human((t) => {
  return `${t.firstname()} ${t.lastname()}`
})

/* Queries */

const humansQuery = selection((t) => {
  var id = t.select(o.human.id)
  var name = t.select(o.human.name)

  return { id, name }
})

const searchQuery = gql.o.query((t) => {
  // Selection
  let search = t.search(
    o.search((s) => {
      return {
        id: s.id(),
        name: s.name(),
      }
    }).list,
  )

  // Return
  return search({ query: 'ts-graphql' })
})

const [result, error] = await gql.fetch(selection)
```

## CLI

- `generate` - looks up for `ts-graphql.yml` and generates the code
- `save` - fetches the schema from an endpoint and saves it to a given destination.
