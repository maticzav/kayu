import { Field } from './document/field'
import { Dict } from './utils'

/**
 * Collects the fields of a given document.
 */
export class Fields<TypeLock extends Dict> {
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
      const response = new ResponseData<TypeLock>(data)
      this.response = { type: 'fetched', response }
    } else {
      this.response = { type: 'fetching' }
    }
  }

  /* Accessors */

  /**
   * Returns the data of the response.
   */
  get data(): Response<TypeLock> {
    return this.response
  }

  /* Methods */

  /**
   * Selects a field in a selection.
   */
  select(...fields: Field[]) {
    this.fields.push(...fields)
  }

  /* Acessors */

  /**
   * Returns a selection of accumulated fields.
   */
  get selection(): Field[] {
    return this.fields
  }
}

/**
 * Response union type has two states:
 *  - fetching while collecting selection
 *  - fetched while decoding data.
 */
export type Response<TypeLock> =
  | { type: 'fetching' }
  | { type: 'fetched'; response: ResponseData<TypeLock> }

/**
 * ResponseData serves as a type port that type annotates
 * types from dictionary based on their key, irrespectable
 * of their hash.
 */
export class ResponseData<TypeLock extends Dict> {
  /* State */
  private data: Dict

  /* Initializer */

  constructor(data: Dict) {
    this.data = data
  }

  /* Accessors */

  /**
   * Returns the typename of the underlying response.
   */
  get typename(): string {
    return this.data['__typename'] as any
  }

  /**
   * Returns the value from data.
   */
  get<K extends keyof TypeLock & string>(
    key: K,
  ): (hash: string) => TypeLock[K] {
    return (hash) => this.data[`${key}_${hash}`] as any
  }

  /**
   * Allows access to the actual return values.
   */
  raw<T>(): T {
    return this.data as T
  }
}

/* SelectionSet */

/**
 * SelectionSet represents a link in a chain that
 * selects the field of a parent using decoder and
 * decodes the response using decoder.
 *
 * Decoder is the central place of query building and exectuion.
 */
export class SelectionSet<TypeLock, Type> {
  /* State */

  /**
   * We use decoder to generate selection given a top most Fields object
   * and to decode response to desired type.
   */
  protected _fields: Fields<TypeLock>
  protected _decoder: (fields: Fields<TypeLock>) => Type
  protected _mock: Type

  /* Initializer */

  constructor(decoder: (fields: Fields<TypeLock>) => Type) {
    this._decoder = decoder
    this._fields = new Fields<TypeLock>()
    /* Make an initial selection and populate fields. */
    this._mock = decoder(this._fields)
  }

  /* Accessors */

  /**
   * Returns a selection of given selection set.
   */
  get fields(): Field[] {
    return this._fields.selection
  }

  /**
   * Returns the mock value used for gathering selection.
   */
  get mock(): Type {
    return this._mock
  }

  /* Methods */

  /**
   * Decodes selection set using a given data.
   */
  decode(data: TypeLock): Type {
    const fields = new Fields<TypeLock>(data)
    return this._decoder(fields)
  }

  /**
   * Turns a selection into a list value.
   */
  get list(): SelectionSet<TypeLock[], Type[]> {
    return selection<TypeLock[], Type[]>((decoder) => {
      /* Selection */
      decoder.select(...this.fields)

      /* Decoder */
      switch (decoder.data.type) {
        case 'fetching':
          return []
        case 'fetched':
          const data = decoder.data.response.raw<TypeLock[]>()
          return data.map((t) => this.decode(t))
      }
    })
  }

  /**
   * Turns a selection into a nullable value.
   */
  get nullable(): SelectionSet<TypeLock | null, Type | null> {
    return selection<TypeLock | null, Type | null>((decoder) => {
      /* Selection */
      decoder.select(...this.fields)

      /* Decoder */
      switch (decoder.data.type) {
        case 'fetching':
          return null
        case 'fetched':
          let data = decoder.data.response.raw<TypeLock | null>()
          if (data !== null) {
            return this.decode(data)
          }
          return null
      }
    })
  }
}

/**
 * Utility function for creating SelectionSet.
 */
export function selection<TypeLock, Type>(
  decoder: (fields: Fields<TypeLock>) => Type,
): SelectionSet<TypeLock, Type> {
  return new SelectionSet<TypeLock, Type>(decoder)
}
