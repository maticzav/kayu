import { composite, leaf } from './document/field'
import { SelectionSet, Fields, selection } from './selection'
import { string, boolean, int, float } from './scalar'

// Scalars

/**
 * FieldTypes represent all the possible fields
 * user may use to make a selection in a given type.
 */
type FieldsTypes = {
  Query: {
    hello: () => string
    human: <T>(selection: SelectionSet<Object['Human'], T>) => T
    // humans: <T>(selection: SelectionSet<Object['Human'], T>) => T[]
    // humans: (selection: Selection<Fields['Human'], any>) => any
  }
  Human: {
    /**
     * Returns the id of a human.
     */
    id: () => string
    name: () => string
  }
}

/**
 * Holds information about all return types from the schema and their
 * identifiers that we use as a reference for TypeLocks.
 *
 * We predefine identifiers to get better error messages and type
 * annotations by the IDE.
 */
type Query = {
  hello: string
  human: Object['Human']
}

type Human = {
  id: string
  name: string
}

type Object = {
  Query: Query
  Human: Human
}

// const Query = { _type: 'Query' as const }
// type Query = typeof Query

const objects = {
  /* Query */
  query: <T>(
    selector: (fields: FieldsTypes['Query']) => T,
  ): SelectionSet<Object['Query'], T> => {
    /* Decoder */

    const decoder = (fields: Fields<Object['Query']>): T => {
      /**
       * These funcitons call to fields that they receive once we
       * start constructing a query.
       *
       * We pass this functions to developer land so that users may
       * make a selection with them.
       */
      const types: FieldsTypes['Query'] = {
        /* hello */
        hello: () => {
          // Select
          fields.select(leaf('hello'))

          // Decode
          const data = fields.data
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return string.mockValue

            /* Return the actual data. */
            case 'fetched':
              return data.response.hello
          }
        },
        /* human */
        human: (selection) => {
          // Make a selection.
          let subfields = new Fields<Object['Human']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('human', subfields.selection))

          // Decode
          const data = fields.data
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return mock

            /* Return the actual data. */
            case 'fetched':
              const datasubfields = new Fields<Object['Human']>(
                data.response.human,
              )
              return selection.decoder(datasubfields)
          }
        },
      }

      return selector(types)
    }

    /* Selector */
    return selection(decoder)
  },

  /* Human */
  human: <T>(
    selector: (fields: FieldsTypes['Human']) => T,
  ): SelectionSet<Object['Human'], T> => {
    /* Decoder */

    const decoder = (fields: Fields<Object['Human']>): T => {
      /* Fields */
      const types: FieldsTypes['Human'] = {
        /* hello */
        id: () => {
          // Select
          fields.select(leaf('id'))

          // Decode
          const data = fields.data
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return string.mockValue

            /* Return the actual data. */
            case 'fetched':
              return data.response.id
          }
        },
        /* human */
        name: () => {
          // Select
          fields.select(leaf('name'))

          // Decode
          const data = fields.data
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return string.mockValue

            /* Return the actual data. */
            case 'fetched':
              return data.response.name
          }
        },
      }

      return selector(types)
    }

    /* Selector */
    return selection(decoder)
  },
}

/* Playground */

const pg_human = objects.human((t) => {
  let id = t.id()
  let name = t.name()

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
