export type Field =
  | { type: 'composite'; name: string; selection: Field[] }
  | { type: 'leaf'; name: string }

/**
 * Creates a new leaf field.
 */
export function leaf(name: string): Field {
  return { type: 'leaf', name }
}

/**
 * Creates a new composite field.
 */
export function composite(name: string, selection: Field[]): Field {
  return { type: 'composite', name, selection }
}
