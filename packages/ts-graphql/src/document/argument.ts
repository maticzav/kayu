import * as hasher from 'object-hash'

type InternalArgument = {
  name: string
  type: string
  value?: any
}

/**
 * Represents an argument in selection.
 * Value is internally represented as any serializable type.
 */
export class Argument {
  /* State */
  private arg: InternalArgument

  /* Initializer */

  constructor(arg: InternalArgument) {
    this.arg = arg
  }

  /* Accessors */

  /**
   * Returns the name of an argument.
   */
  get name(): string {
    return this.arg.name
  }

  /**
   * Returns the type of an argument.
   */
  get type(): string {
    return this.arg.type
  }

  /**
   * Returns the value of an argument.
   */
  get value(): any | undefined {
    return this.arg.value
  }

  /**
   * Returns the alias of an argument.
   * We use alias to reference arguemnts globally in the query.
   */
  get alias(): string {
    return `_${this.hash}`
  }

  /**
   * Calculates the hash of the argument.
   */
  get hash(): string {
    return hasher.MD5(this.arg)
  }

  /* Methods */

  /**
   * Returns the JSON represetnation of an argument.
   */
  toJSON(): object {
    return this.arg
  }
}

/**
 * Creates a new argument instance.
 */
export function arg<T>(name: string, type: string, value?: T): Argument {
  return new Argument({ name, type, value })
}
