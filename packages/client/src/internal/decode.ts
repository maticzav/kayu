/**
 * Tries to decode nullable field using non-null decoder.
 */
export function nullable<T, Y>(fn: (val: T) => Y): (val: T | null) => Y | null {
  return (val) => {
    if (val === null) return null
    return fn(val)
  }
}

/**
 * Tries to decode list field using non-list decoder.
 */
export function list<T, Y>(fn: (val: T) => Y): (val: T[]) => Y[] {
  return (val) => {
    return val.map(fn)
  }
}
