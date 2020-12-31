import { composite, Field, leaf } from './document/field'

/**
 * Collects the fields of a given document.
 */
class Fields<TypeLock> {
  /* State */

  private fields: Field[]
  private response: Response<TypeLock>

  /* Accessors */

  data(): Response<TypeLock> {
    return this.response
    // switch (this.response.type) {
    //   /* Return null for mocking purposes. */
    //   case 'fetching':
    //     return null as any

    //   /* Return the actual data. */
    //   case 'fetched':
    //     return this.response.response
    // }
  }

  /* Methods */

  /**
   * Selects a field in a selection.
   */
  select(field: Field) {
    this.fields.push(field)
  }
}

type Response<TypeLock> =
  | { type: 'fetching' }
  | { type: 'fetched'; response: TypeLock }

/**
 * SelectionSet represents a link in a chain that
 * selects the field of a parent using decoder and
 * decodes the response using decoder.
 *
 * Decoder is the central place of query building and exectuion.
 */
type SelectionSet<TypeLock, Type> = {
  /**
   * Locks the type of a given seleciton.
   */
  readonly _typelock: TypeLock
  /**
   * We use decoder to generate selection given a top most Fields object
   * and to decode response to desired type.
   */
  decoder: (fields: Fields<TypeLock>) => Type
}

/**
 * Utility function for creating SelectionSet.
 */
function selection<TypeLock, Type>(
  type: TypeLock,
  decoder: (fields: Fields<TypeLock>) => Type,
): SelectionSet<TypeLock, Type> {
  return { _typelock: type, decoder }
}

// class SelectionSet<TypeLock, Type> {
//   /* State */

//   private decoder: (fields: Fields<TypeLock>) => Type
//   private fields: Fields<TypeLock>

//   /* Initializer */

//   constructor(decoder: (fields: Fields<TypeLock>) => Type) {
//     this.decoder = decoder
//     this.fields = new Fields<TypeLock>()
//   }
// }

// /**
//  * Creates a new selection for a given type.
//  */
// function selection<TypeLock, Type>(
//   fn: (fields: Fields<TypeLock>) => Type,
// ): SelectionSet<TypeLock, Type> {
//   return new SelectionSet<TypeLock, Type>(fn)
// }

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
/* "Generated" code */

const schema = /* graphql */ `
  type Query {
    hello: String!
  }
`

type S<TypeLock> = { type: never }

/* Manual code */

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
 * Holds information about all return types from the schema.
 */
type Object = {
  Query: {
    hello: string
    human: Object['Human']
  }
  Human: {
    id: string
    name: string
  }
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
        /* hello field */
        hello: () => {
          // Select
          fields.select(leaf('hello'))

          // Decode
          const data = fields.data()
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return null as any

            /* Return the actual data. */
            case 'fetched':
              return data.response.hello
          }
        },
        /* hello field */
        human: (selection) => {
          let subfields = new Fields<Object['Human']>()

          selection.decoder(subfields)

          // Select
          fields.select(composite('human', subfields))

          // Decode
          const data = fields.data()
          switch (data.type) {
            /* Return null for mocking purposes. */
            case 'fetching':
              return null as any

            /* Return the actual data. */
            case 'fetched':
              return data.response.human
          }
        },
      }

      return selector(types)
    }

    /* Type */
    const type = Query

    // return selector()
    return selection(type, decoder)
  },

  /***
   *
   *
   *
   *
   *
   *
   *
   */

  /* Human */
  human: <T>(
    selector: (fields: FieldsTypes['Query']) => T,
  ): SelectionSet<Query, T> => {
    return selection()
  },
}
