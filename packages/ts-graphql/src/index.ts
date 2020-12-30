/* Schema */

import { Field, leaf } from './document/field'

const schema = /* graphql */ `
  type Query {
    hello: String!
  }
`

/* Manual code */

type Response<TypeLock> =
  | { type: 'fetching' }
  | { type: 'fetched'; response: TypeLock }

class Fields<TypeLock> {
  /* State */

  private fields: Field[]
  private response: Response<TypeLock>

  /* Accessors */

  data(): TypeLock {
    switch (this.response.type) {
      /* Return null for mocking purposes. */
      case 'fetching':
        return null as any

      /* Return the actual data. */
      case 'fetched':
        return this.response.response
    }
  }

  /* Methods */

  /**
   * Selects a field in a selection.
   */
  select(field: Field) {
    this.fields.push(field)
  }
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

type SelectionSet<TypeLock, Type> = {
  _typelock: TypeLock
  // _type: Type
  decoder: (fields: Fields<TypeLock>) => Type
}

/* Generated code */

type Object = {
  Query: {
    hello: string
    humans: Object['Human'][]
  }
  Human: {
    id: string
    name: string
  }
}

type FieldTypes = {
  Query: {
    hello: () => string
    humans: <T>(selection: SelectionSet<Human, T>) => T[]
    // humans: (selection: Selection<Fields['Human'], any>) => any
  }
  Human: {
    id: () => string
    name: () => string
  }
}

type Query = { _type: 'Query' }

function query<Type>(
  fn: (fields: FieldTypes['Query']) => Type,
): SelectionSet<Query, Type> {
  /* Fields */
  const fields = new Fields<Object['Query']>()

  /* Selection */
  const selection: FieldTypes['Query'] = {
    hello: () => {
      /* Selection */
      fields.select(leaf('hello'))

      /* Decoding */
      return fields.data().hello
    },
    humans: <T>(selection: SelectionSet<Human, T>) => {
      return fields.data().humans.map(selection.decoder)
    },
  }

  return {
    _typelock: { _type: 'Query' },
    // _type: fn(selection),
    decoder: fn,
  }
}

type Human = { _type: 'Human' }

function human<Type>(
  fn: (fields: FieldTypes['Human']) => Type,
): SelectionSet<Human, Type> {
  /* Fields */
  const fields = new Fields<Object['Human']>()

  /* Selection */
  const selection: FieldTypes['Human'] = {
    id: () => {
      /* Selection */
      fields.select(leaf('id'))

      /* Decoding */
      return fields.data().id
    },
    name: () => {
      /* Selection */
      fields.select(leaf('name'))

      /* Decoding */
      return fields.data().name
    },
  }

  return {
    _typelock: { _type: 'Human' },
    decoder: fn,
  }
}

// function Query<T>(selection: F): Fields['Query'] {
//   /* Hello */
//   function hello(): string {
//     /* Selection */
//     selection.select(leaf('hello'))

//     /* Decoding */
//     return ''
//   }

//   return {
//     hello,
//   }
// }

// type Selection<TypeLock, ReturnType> = {
//   lock: TypeLock
//   return: ReturnType
// }

/* Namespace utility */

// function query<T>(fn: (fields: Fields['Query']) => T): T {
//   let fields = new F()
//   return fn(Query(fields))
// }

// const SelectionSet = {
//   query,
//   // Human: humanSelection,
// }

/* Playground */

// const human = SelectionSet.Human((t) => {
//   return 'hey'
// })

/**
 * I don't want to have to specify return type every time I do this.
 * TS should infer the return type of the returning object from the selection.
 *
 * I think we need to reduce phantomness of the selection to achieve this.
 */
const h = human((t) => {
  return t.name()
})

const pg = query((t) => {
  return t.humans(human((t) => t.name()))
})

// const playground = query((t) => {
//   return t.hello()
// })

// /* Query type */

// function querySelection<T>(
//   fn: (fields: Fields['Query']) => T,
// ): Selection<Fields['Query'], T> {
//   let fields: Fields['Query'] = {
//     humans: () => {},
//   }

//   return fn(fields)
// }

// /* Human type */

// function humanSelection<T>(
//   fn: (fields: Fields['Human']) => T,
// ): Selection<Fields['Human'], T> {
//   let fields = {}

//   return fn(fields)
// }
