import { composite, Field, leaf } from './document/field'

/**
 * Collects the fields of a given document.
 */
class Fields<TypeLock> {
  /* State */

  // WIP: Try dictionary structure for fields?
  private fields: Field[]
  private readonly response: Response<TypeLock>

  /* Initializer */

  constructor(data?: TypeLock) {
    // Set selection to none.
    this.fields = []

    // Set response according to the given data.
    if (data) {
      this.response = { type: 'fetched', response: data }
    } else {
      this.response = { type: 'fetching' }
    }
  }

  /* Accessors */

  get data(): Response<TypeLock> {
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

  /* Acessors */

  /**
   * Returns a selection of accumulated fields.
   */
  get selection(): Field[] {
    return this.fields
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
  // readonly _typelock: TypeLock
  /**
   * We use decoder to generate selection given a top most Fields object
   * and to decode response to desired type.
   */
  decoder: (fields: Fields<TypeLock>) => Type
}

// class SelectionSet<TypeLock, Type> {
//   /**
//    * Locks the type of a given seleciton.
//    */
//   private readonly typelock: TypeLock

//   /**
//    * We use decoder to generate selection given a top most Fields object
//    * and to decode response to desired type.
//    */
//   readonly decoder: (fields: Fields<TypeLock>) => Type

//   /* Initializer */

//   constructor(type: TypeLock, decoder: (fields: Fields<TypeLock>) => Type) {
//     this.typelock = type
//     this.decoder = decoder
//   }

//   /* Methods */
// }

/**
 * Utility function for creating SelectionSet.
 */
function selection<TypeLock, Type>(
  decoder: (fields: Fields<TypeLock>) => Type,
): SelectionSet<TypeLock, Type> {
  return { decoder }
  // return new SelectionSet(type, decoder)
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
              return null as any

            /* Return the actual data. */
            case 'fetched':
              return data.response.hello
          }
        },
        /* human */
        human: (selection) => {
          // Make a selection.
          let subfields = new Fields<Object['Human']>()
          selection.decoder(subfields)
          fields.select(composite('human', subfields.selection))

          // Decode
          const data = fields.data
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

    /* Selector */
    return selection(decoder)
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
              return null as any

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
              return null as any

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
  return 'hey'
})

let fields = new Fields<Object['Query']>()

pg.decoder(fields)

console.log(JSON.stringify(fields, null, 2))
