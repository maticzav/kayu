import { defined, indent, isURL } from '../src/utils'

describe('utils', () => {
  test('indent', () => {
    expect(indent(2)('abc')).toBe('  abc')
  })

  test('defined', () => {
    expect(defined('Matic')).toBeTruthy()
    expect(defined(undefined)).toBeFalsy()
  })

  test('isURL', () => {
    expect(isURL('https://github.com')).toBeTruthy()
    expect(isURL('whatever')).toBeFalsy()
  })
})
