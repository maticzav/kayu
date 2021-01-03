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
   * Returns the value from data.
   */
  get<K extends keyof TypeLock & string>(
    key: K,
  ): (hash: string) => TypeLock[K] {
    return (hash) => this.data[`${key}_${hash}`] as any
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
export type SelectionSet<TypeLock, Type> = {
  /**
   * We use decoder to generate selection given a top most Fields object
   * and to decode response to desired type.
   */
  decoder: (fields: Fields<TypeLock>) => Type
}

/**
 * Utility function for creating SelectionSet.
 */
export function selection<TypeLock, Type>(
  decoder: (fields: Fields<TypeLock>) => Type,
): SelectionSet<TypeLock, Type> {
  return { decoder }
  // return new SelectionSet(type, decoder)
}
