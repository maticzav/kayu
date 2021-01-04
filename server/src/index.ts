import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import { makeSchema } from 'nexus'
import * as path from 'path'

import { data } from './data'
import * as allTypes from './graphql'
import { ContextType } from './types/backingTypes'

/* Schema */

export const schema = makeSchema({
  types: allTypes,
  nonNullDefaults: {
    input: true,
    output: true,
  },
  outputs: {
    typegen: path.join(__dirname, 'nexus.types.ts'),
    schema: path.join(__dirname, './schema.graphql'),
  },
  sourceTypes: {
    modules: [
      {
        module: path.join(
          __dirname.replace(/\/dist$/, '/src'),
          './types/backingTypes.ts',
        ),
        alias: 'swapi',
      },
    ],
  },
  contextType: {
    module: path.join(
      __dirname.replace(/\/dist$/, '/src'),
      './types/backingTypes.ts',
    ),
    export: 'ContextType',
  },
  prettierConfig: require.resolve('../../prettier.config.js'),
})

/* Server */

export const apollo = new ApolloServer({
  schema,
  debug: true,
  context: ({ req }) => {
    /* Context */
    let context: ContextType = {
      req: req,
      data: data,
    }
    return context
  },
  plugins: [
    /**
     * Logs the query to the console.
     */
    {
      requestDidStart(requestContext) {
        console.log(requestContext.request.query)
        return {}
      },
    },
    /**
     * Saves responses for debuging purposes.
     */
    // {
    //   requestDidStart(ctx) {
    //     const operation = ctx.request.operationName

    //     if (!operation) return {}

    //     console.log(`Incoming request ${operation}`)

    //     const filename = `${operation}.json`
    //     const filepath = path.resolve(__dirname, '../responses', filename)

    //     return {
    //       willSendResponse(resp) {
    //         // Save the response to a file.

    //         try {
    //           const data = JSON.stringify(resp.response, null, 2)
    //           fs.writeFileSync(filepath, data)
    //         } catch (err) {
    //           console.log(err)
    //         }

    //         return resp
    //       },
    //     }
    //   },
    // },
  ],
})

/* Start */

if (require.main === module) {
  const port = parseInt(process.env.PORT || '4000')

  const app = express()

  apollo.applyMiddleware({ app })

  app.listen(port, () => {
    console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`)
  })
}
