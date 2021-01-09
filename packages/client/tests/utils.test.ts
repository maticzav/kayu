import { defined, indent } from '../src/utils'

describe('utils', () => {
  test('indent', () => {
    expect(indent(2)('abc')).toBe('  abc')
  })

  test('defined', () => {
    expect(defined('Matic')).toBeTruthy()
    expect(defined(undefined)).toBeFalsy()
  })
})
