import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

import { generate, pkg } from '../src/bin/'

const readfile = promisify(fs.readFile)

/* Constants */

const FIXTURES = path.resolve(__dirname, './__fixtures__/')
const API_PATH = path.resolve(FIXTURES, './api.ts')

/* Tests */

describe('bin', () => {
  test('finds the root of the project', async () => {
    expect(await pkg(FIXTURES)).toBe(FIXTURES)
  })

  test('generates API using schema', async () => {
    await generate(FIXTURES)

    const code = await readfile(API_PATH, { encoding: 'utf-8' })

    expect(code).toMatchSnapshot()
  })
})
