# ts-graphql

## TODOs:

- [ ] PostInstall script and configuration loading,
- [ ] Documentation (best if you copy most of it from Swift GraphQL)
- [ ] CodeSandbox playground demo
- [ ] server on Heroku
- [ ] Extend tests with Union, Interface, CustomScalar fetching and similar (best if you copy the demo code in ete tests in SGQL).

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
