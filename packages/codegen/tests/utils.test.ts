import { defined, isURL } from '../src/utils'

describe('utils', () => {
  test('defined', () => {
    expect(defined('Matic')).toBeTruthy()
    expect(defined(undefined)).toBeFalsy()
  })

  test('isURL', () => {
    expect(isURL('https://github.com')).toBeTruthy()
    expect(isURL('whatever')).toBeFalsy()
  })
})
