import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

import { generate, pkg } from '../src/bin/'

const readfile = promisify(fs.readFile)

/* Constants */

const FIXTURES = path.resolve(__dirname, './__fixtures__/')
const API_PATH = path.resolve(FIXTURES, './api.ts')

/* Tests */

describe('generator', () => {
  test('generates API using schema', async () => {
    await generate(FIXTURES)

    const code = await readfile(API_PATH, { encoding: 'utf-8' })

    expect(code).toMatchSnapshot()
  })

  test('generates API using URL', async () => {
    await generate(path.resolve(FIXTURES, './url'))

    const code = await readfile(API_PATH, { encoding: 'utf-8' })
    expect(code).toMatchSnapshot()
  })

  test('generates API using SDL', async () => {
    await generate(path.resolve(FIXTURES, './sdl'))

    const code = await readfile(API_PATH, { encoding: 'utf-8' })
    expect(code).toMatchSnapshot()
  })
})

/* Utility functions */

test('finds the root of the project', async () => {
  const SDL_ROOT = path.resolve(FIXTURES, './sdl')
  expect(await pkg(SDL_ROOT)).toBe(SDL_ROOT)
})
