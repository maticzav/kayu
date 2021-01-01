import { Argument, hash } from './argument'

export type Field =
  | {
      kind: 'composite'
      name: string
      arguments: Argument[]
      selection: Field[]
    }
  | { kind: 'leaf'; name: string; arguments: Argument[] }
  | { kind: 'fragment'; type: string; selection: Field[] }

/**
 * Creates a new leaf field.
 */
export function leaf(name: string, args: Argument[] = []): Field {
  return { kind: 'leaf', name, arguments: args }
}

/**
 * Creates a new composite field.
 */
export function composite(
  name: string,
  selection: Field[],
  args: Argument[] = [],
): Field {
  return { kind: 'composite', name, arguments: args, selection }
}

/**
 * Creates a new fragment field.
 */
export function fragment(type: string, selection: Field[]): Field {
  return { kind: 'fragment', type, selection }
}

/* Utility functions */

/**
 * Returns an alias of a given field if it has arguments.
 * Otherwise, it returns undefined.
 */
export function alias(field: Field): string | undefined {
  switch (field.kind) {
    case 'leaf':
    case 'composite': {
      return `${field.name}_${hash(field.arguments)}`
    }
    case 'fragment': {
      return undefined
    }
  }
}

/**
 * Returns all arguments in fields' tree.
 */
export function argumentsOfFields(fields: Field[]): Argument[] {
  return fields.flatMap((field) => {
    /**
     * Reuse it for every field.
     */
    switch (field.kind) {
      case 'leaf': {
        return field.arguments
      }
      case 'composite': {
        return [...field.arguments, ...argumentsOfFields(field.selection)]
      }
      /**
       * Recursively gets arguments of a subselection.
       */
      case 'fragment': {
        return [...argumentsOfFields(field.selection)]
      }
    }
  })
}
