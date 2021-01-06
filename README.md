<div align="center"><img src="media/thumbnail.png" width="320" /></div>

<div align="center">
  <a href="https://kayujs.org/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://kayujs.org/docs/">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://kayujs.org/sandbox">Sandbox</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://kayujs.org/blog">Blog</a>
</div>

## Features

- ✨ **Intuitive:** You'll forget about the GraphQL layer altogether.
- 🦅 **TS-First:** It lets you use TypeScript language features in favour of GraphQL structures.
- 🏖 **Time Saving:** Save time when debugging - it guarantees that every query is valid.
- 🏔 **High Level:** You don't have to worry about naming collisions, variables, _anything_. Just TypeScript.

## Overview

Kayu is a TypeScript code generator and a lightweight client. It lets you create queries using TypeScirpt, and guarantees that every query you create is valid.

The library revolves around three core principles:

- 🚀 If your project compiles, your queries work;
- 🦉 Use TypeScript in favour of GraphQL wherever possible;
- 🌳 Laverage TypeScript type inference to its fullest;
- 📚 Write queries using code and use TypeScript compiler as a validator.

I have created it because there seemed to be a gap in existing clients - you could either send raw queries as strings or use full blown clients with caching and whatnot. On the other hand, you'd need to read lots of documentation unrelated to your project to get TypeScript's type-checker to work. This library aims to merge that gap and simplify overall workflow.

## Example

- Try an interactive demo on [CodeSandbox](https://kayujs.org).

```ts
import { objects, send } from './api'

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
  endpoint: 'https://swapi-ql.herokuapp.com/graphql',
  selection: query,
})
```

## Installation

Create a configuration file in the root of your project (next to your `package.json`) called `kayu.config.js`.

```ts
module.exports = {
  endpoint: 'https://yourgraphql.com', // your API endpoint
  api: './src/api.ts', // path to generated file
  schema: './schema.json', // path to cache
}
```

Now install Kayu using package manager of your choice.

```bash
yarn install @kayu/client
```

When you install Kayu, it'll try to guess the root of your project and check for a configuraiton there. If it doesn't exist yet, it'll scaffold one for you. Run `kayu` to regenerate the API. On every subsequent install, Kayu will try to regenerate API from your endpoint. If it cannot reach endpoint, it'll try to reuse cached schema.

That's it! 🎉

I encourage you to _simply_ import the generate library and try to guess how it works - it's very simple! To learn more about Kayu, read the [docs](https://kayujs.org/docs).
