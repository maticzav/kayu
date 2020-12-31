import { Field } from './document/field'

/**
 * Collects the fields of a given document.
 */
export class Fields<TypeLock> {
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

export type Response<TypeLock> =
  | { type: 'fetching' }
  | { type: 'fetched'; response: TypeLock }

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
