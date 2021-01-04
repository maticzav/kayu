import * as hasher from 'object-hash'
import { defined, indent } from '../utils'

import { Argument } from './argument'

// export type Field =
//   | {
//       kind: 'composite'
//       name: string
//       arguments: Argument[]
//       selection: Field[]
//     }
//   | { kind: 'leaf'; name: string; arguments: Argument[] }
//   | { kind: 'fragment'; type: string; selection: Field[] }

type InternalField =
  | {
      kind: 'composite'
      name: string
      arguments: Argument[]
      selection: Field[]
    }
  | { kind: 'leaf'; name: string; arguments: Argument[] }
  | { kind: 'fragment'; type: string; selection: Field[] }

export class Field {
  /* State */

  private field: InternalField

  /* Initializer */

  constructor(field: InternalField) {
    this.field = field
  }

  /* Accessors */

  /**
   * Returns an alias of a given field should have an alias,
   * otherwise it returns undefined.
   */
  get alias(): string | undefined {
    switch (this.field.kind) {
      case 'leaf':
      case 'composite': {
        return `${this.field.name}_${this.hash}`
      }
      case 'fragment': {
        return undefined
      }
    }
  }

  /**
   * Returns the hash value of a field that we may use to reference the field.
   * It comes in as a second part of the alias.
   */
  get hash(): string | undefined {
    return hasher.MD5(this.field)
  }

  get arguments(): Argument[] {
    switch (this.field.kind) {
      case 'leaf': {
        return this.field.arguments
      }
      /**
       * Recursively gets arguments of a subselection and adds them
       * to arguments of this field.
       */
      case 'composite': {
        return [
          ...this.field.arguments,
          ...this.field.selection.flatMap((f) => f.arguments),
        ]
      }
      /**
       * Recursively gets arguments of a subselection.
       */
      case 'fragment': {
        return this.field.selection.flatMap((f) => f.arguments)
      }
    }
  }

  /* Methods */

  /**
   * Serializes a field into a GraphQL SDL.
   */
  serialize(): string[] {
    switch (this.field.kind) {
      /* Leaf */
      case 'leaf': {
        /**
         * We check that a field has an argument and append all of those arguments if
         * they are specified.
         */
        let args: string = ''
        const argsWithValue = this.field.arguments
          .filter((arg) => defined(arg.value))
          .map((arg) => `${arg.name}: $${arg.alias}`)

        if (argsWithValue.length > 0) {
          args = `(${argsWithValue.join(',')})`
        }

        return [`${this.alias!}: ${this.field.name}${args}`]
      }
      /* Composite */
      case 'composite': {
        let args: string = ''
        const argsWithValue = this.field.arguments
          .filter((arg) => defined(arg.value))
          .map((arg) => `${arg.name}: $${arg.alias}`)

        if (argsWithValue.length > 0) {
          args = `(${argsWithValue.join(',')})`
        }

        return [
          `${this.alias!}: ${this.field.name}${args} {`,
          indent(2)('__typename'),
          ...this.field.selection.flatMap((f) => f.serialize()).map(indent(2)),
          `}`,
        ]
      }
      /* Fragment */
      case 'fragment': {
        return [
          `... on ${this.field.type} {`,
          indent(2)('__typename'),
          ...this.field.selection.flatMap((f) => f.serialize()).map(indent(2)),
          `}`,
        ]
      }
    }
  }
}

/* Utility functions */

/**
 * Creates a new leaf field.
 */
export function leaf(name: string, args: Argument[] = []): Field {
  return new Field({ kind: 'leaf', name, arguments: args })
}

/**
 * Creates a new composite field.
 */
export function composite(
  name: string,
  selection: Field[],
  args: Argument[] = [],
): Field {
  return new Field({ kind: 'composite', name, arguments: args, selection })
}

/**
 * Creates a new fragment field.
 */
export function fragment(type: string, selection: Field[]): Field {
  return new Field({ kind: 'fragment', type, selection })
}
