import { objectType, idArg, arg } from 'nexus'
import { getAuthorization } from '../utils'

/* Query */

export const Query = objectType({
  name: 'Query',
  definition(t) {
    /* Singles */

    t.nullable.field('human', {
      type: 'Human',
      args: {
        id: idArg({
          description: 'id of the character',
        }),
      },
      resolve: (_, { id }, ctx) => ctx.data.getHuman(id),
    })

    t.nullable.field('droid', {
      type: 'Droid',
      args: {
        id: idArg({
          description: 'id of the character',
        }),
      },

      resolve: (_, { id }, ctx) => ctx.data.getDroid(id),
    })

    /* Union */

    t.nullable.field('character', {
      type: 'CharacterUnion',
      args: {
        id: idArg({
          description: 'id of the character',
        }),
      },

      resolve: (_, { id }, ctx) => ctx.data.getCharacter(id),
    })

    /* Never Null Nulalble */
    t.nullable.field('luke', {
      type: 'Human',

      resolve: (_, {}, ctx) => ctx.data.getHuman('1000')!,
    })

    /* Collections, Interfaces */

    t.list.field('humans', {
      type: 'Human',
      resolve: (_, {}, ctx) => ctx.data.allHumans,
    })

    t.list.field('droids', {
      type: 'Droid',
      resolve: (_, {}, ctx) => ctx.data.allDroids,
    })

    t.list.field('characters', {
      type: 'Character',
      resolve: (_, {}, ctx) => ctx.data.allCharacters,
    })

    /* Inputs */

    t.string('greeting', {
      args: {
        input: arg({
          type: 'Greeting',
        }),
      },
      resolve: (_, { input }, ctx) => {
        if (!input) return 'Hello World!'

        switch (input.language) {
          case 'EN':
            return `Hello ${input.name}`
          case 'SL':
          default:
            return `Pozdravljen ${input.name}`
        }
      },
    })

    /* Authorization */

    t.string('whoami', {
      resolve: (_, {}, ctx) => {
        const user = getAuthorization(ctx)
        return user
      },
    })

    /* Custom Scalar */

    // t.date('time', {
    //   resolve: () => new Date(),
    // })
  },
})
