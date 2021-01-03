# ts-graphql

- make strict type inferences - use null when appropriate
- object is the same as structure in Swift - roughly
- have auto running postscript + cli utility to fetch schema and save it

When you install it, we try to guess the root directory and create configuration file if it doesn't exist yet.
If it does exist, we should generate the library every time user installs it.

## Configuration

```yml
endpoint: url
schema: local_path
output: local_path | node_modules default
```

Binary by default tries to reach the server. If the server cannot be reached, we use local version of the schema. Save files in `.kayak`.

## Playground

```ts
const pg_human = objects.human((t) => {
  let id = t.id()
  let name = t.name()()

  return { id, name }
})

const pg = objects.query((t) => {
  let hello = t.hello()
  let human = t.human(pg_human)
  return `${human.name} ${hello}`
})

let fields = new Fields<Object['Query']>()

pg.decoder(fields)

console.log(JSON.stringify(fields, null, 2))

const data = {
  hello: 'Hey!',
  human: {
    id: 'id',
    name: 'Matic',
  },
}

let fieldsWithData = new Fields<Object['Query']>(data)

let result = pg.decoder(fieldsWithData)

console.log(result)

console.log(
  serialize({
    fields: fields.selection,
    operationType: OperationType.Query,
  }),
)
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

// const searchQuery = o.query((t) =>
//   t.search({ query: 'ts-graphql' })(
//     o.search((s) => {
//       return {
//         id: s.id(),
//         name: s.name(),
//       }
//     }).list,
//   ),
// )

const [result, error] = await gql.fetch(selection)
```

## CLI

- `generate` - looks up for `ts-graphql.yml` and generates the code
- `save` - fetches the schema from an endpoint and saves it to a given destination.
