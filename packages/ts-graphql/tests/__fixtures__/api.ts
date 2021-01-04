// DO NOT edit this file manually. It was auto-generated using maticzav/ts-graphql.

import {
  composite,
  leaf,
  fragment,
  Field,
  arg,
  Argument,
  SelectionSet,
  Fields,
  selection,
  nullable,
  list,
  OperationType,
  SendInput,
  perform,
} from 'ts-graphql/__generator'

/* Scalars */

import * as codecs from '/Users/maticzavadlal/Code/mine/typescript-graphql/packages/ts-graphql/tests/__fixtures__/codecs.ts'
export type Scalar = {
  ID: string
  String: string
  Float: number
  Int: number
  Boolean: boolean
  Date: codecs.DateCodec
}

const ScalarMock = {
  ID: '8376',
  String: 'Matic Zavadlal',
  Float: 3.14,
  Int: 92,
  Boolean: true,
  Date: codecs.DateCodec.mock,
}
const ScalarDecoder = {
  ID: (val: string) => val,
  String: (val: string) => val,
  Float: (val: number) => val,
  Int: (val: number) => val,
  Bool: (val: boolean) => val,
  Date: codecs.DateCodec.decode,
}

/* Types */

type DroidObject = {
  __typename: 'Droid'
  id: Scalar['ID']
  name: Scalar['String']
  primaryFunction: Scalar['String']
  appearsIn: Array<Enum['Episode']>
}

type HumanObject = {
  __typename: 'Human'
  id: Scalar['ID']
  name: Scalar['String']
  homePlanet: Scalar['String'] | null
  appearsIn: Array<Enum['Episode']>
  infoURL: Scalar['String'] | null
}

type QueryObject = {
  __typename: 'Query'
  human: Object['Human'] | null
  droid: Object['Droid'] | null
  character: Union['CharacterUnion'] | null
  luke: Object['Human'] | null
  humans: Array<Object['Human']>
  droids: Array<Object['Droid']>
  characters: Array<Interface['Character']>
  greeting: Scalar['String']
  whoami: Scalar['String']
}

export type Object = {
  Droid: DroidObject
  Human: HumanObject
  Query: QueryObject
}

type CharacterInterface =
  | {
      __typename: 'Droid'
      id: Scalar['ID']
      name: Scalar['String']
      primaryFunction: Scalar['String']
      appearsIn: Array<Enum['Episode']>
    }
  | {
      __typename: 'Human'
      id: Scalar['ID']
      name: Scalar['String']
      homePlanet: Scalar['String'] | null
      appearsIn: Array<Enum['Episode']>
      infoURL: Scalar['String'] | null
    }

export type Interface = {
  Character: CharacterInterface
}

type CharacterUnionUnion =
  | {
      __typename: 'Human'
      id: Scalar['ID']
      name: Scalar['String']
      homePlanet: Scalar['String'] | null
      appearsIn: Array<Enum['Episode']>
      infoURL: Scalar['String'] | null
    }
  | {
      __typename: 'Droid'
      id: Scalar['ID']
      name: Scalar['String']
      primaryFunction: Scalar['String']
      appearsIn: Array<Enum['Episode']>
    }

export type Union = {
  CharacterUnion: CharacterUnionUnion
}

enum EpisodeEnum {
  NEWHOPE = 'NEWHOPE',
  EMPIRE = 'EMPIRE',
  JEDI = 'JEDI',
}

enum LanguageEnum {
  EN = 'EN',
  SL = 'SL',
}

export const Enum = {
  Episode: EpisodeEnum,
  Language: LanguageEnum,
}

export type Enum = {
  Episode: EpisodeEnum
  Language: LanguageEnum
}

type GreetingInputObject = {
  language: Enum['Language']
  name: Scalar['String']
}

type GreetingOptionsInputObject = {
  prefix: Scalar['String']
}

export type InputObject = {
  Greeting: GreetingInputObject
  GreetingOptions: GreetingOptionsInputObject
}

/* Operations */

export async function send<TypeLock extends { __typename: 'Query' }, Type>(
  opts: SendInput<TypeLock, Type>,
): Promise<[Type] | [null, Error]> {
  return perform({ operation: opts.selection.operation!, ...opts })
}

/* Documentation */

type Documentation = {
  Droid: {
    id: () => Scalar['ID']
    name: () => Scalar['String']
    primaryFunction: () => Scalar['String']
    appearsIn: () => Array<Enum['Episode']>
  }
  Human: {
    id: () => Scalar['ID']
    name: () => Scalar['String']
    homePlanet: () => Scalar['String'] | null
    appearsIn: () => Array<Enum['Episode']>
    infoUrl: () => Scalar['String'] | null
  }
  Query: {
    human: (params: {
      id: Scalar['ID']
    }) => <T>(selection: SelectionSet<Object['Human'] | null, T>) => T
    droid: (params: {
      id: Scalar['ID']
    }) => <T>(selection: SelectionSet<Object['Droid'] | null, T>) => T
    character: (params: {
      id: Scalar['ID']
    }) => <T>(selection: SelectionSet<Union['CharacterUnion'] | null, T>) => T
    luke: <T>(selection: SelectionSet<Object['Human'] | null, T>) => T
    humans: <T>(selection: SelectionSet<Array<Object['Human']>, T>) => T
    droids: <T>(selection: SelectionSet<Array<Object['Droid']>, T>) => T
    characters: <T>(
      selection: SelectionSet<Array<Interface['Character']>, T>,
    ) => T
    greeting: (params: { input: InputObject['Greeting'] }) => Scalar['String']
    whoami: () => Scalar['String']
  }
  Character: {
    id: () => Scalar['ID']
    name: () => Scalar['String']
    on: <T>(selectors: {
      droid: SelectionSet<Object['Droid'], T>
      human: SelectionSet<Object['Human'], T>
    }) => T
  }
  CharacterUnion: {
    on: <T>(selectors: {
      human: SelectionSet<Object['Human'], T>
      droid: SelectionSet<Object['Droid'], T>
    }) => T
  }
}

/* Selections */

export const objects = {
  droid: <T>(
    selector: (fields: Documentation['Droid']) => T,
  ): SelectionSet<Object['Droid'], T> => {
    const decoder = (fields: Fields<Object['Droid']>): T => {
      const types: Documentation['Droid'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('id', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['ID']
            case 'fetched':
              return ScalarDecoder.ID(data.response.get('id')(field.hash!))
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('name', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('name')(field.hash!),
              )
          }
        },
        /* primaryFunction */
        primaryFunction: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('primaryFunction', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('primaryFunction')(field.hash!),
              )
          }
        },
        /* appearsIn */
        appearsIn: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('appearsIn', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return []
            case 'fetched':
              return list(<T>(t: T) => t)(
                data.response.get('appearsIn')(field.hash!),
              )
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
  human: <T>(
    selector: (fields: Documentation['Human']) => T,
  ): SelectionSet<Object['Human'], T> => {
    const decoder = (fields: Fields<Object['Human']>): T => {
      const types: Documentation['Human'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('id', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['ID']
            case 'fetched':
              return ScalarDecoder.ID(data.response.get('id')(field.hash!))
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('name', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('name')(field.hash!),
              )
          }
        },
        /* homePlanet */
        homePlanet: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('homePlanet', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return nullable(ScalarDecoder.String)(
                data.response.get('homePlanet')(field.hash!),
              )
          }
        },
        /* appearsIn */
        appearsIn: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('appearsIn', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return []
            case 'fetched':
              return list(<T>(t: T) => t)(
                data.response.get('appearsIn')(field.hash!),
              )
          }
        },
        /* infoUrl */
        infoUrl: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('infoURL', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return nullable(ScalarDecoder.String)(
                data.response.get('infoURL')(field.hash!),
              )
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
  query: <T>(
    selector: (fields: Documentation['Query']) => T,
  ): SelectionSet<Object['Query'], T> => {
    const decoder = (fields: Fields<Object['Query']>): T => {
      const types: Documentation['Query'] = {
        /* human */
        human: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          /* Selection */
          const field = composite('human', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(data.response.get('human')(field.hash!))
          }
        },
        /* droid */
        droid: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          /* Selection */
          const field = composite('droid', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(data.response.get('droid')(field.hash!))
          }
        },
        /* character */
        character: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          /* Selection */
          const field = composite('character', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(
                data.response.get('character')(field.hash!),
              )
          }
        },
        /* luke */
        luke: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = composite('luke', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(data.response.get('luke')(field.hash!))
          }
        },
        /* humans */
        humans: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = composite('humans', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(data.response.get('humans')(field.hash!))
          }
        },
        /* droids */
        droids: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = composite('droids', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(data.response.get('droids')(field.hash!))
          }
        },
        /* characters */
        characters: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = composite('characters', selection.fields, args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selection.mock
            case 'fetched':
              return selection.decode(
                data.response.get('characters')(field.hash!),
              )
          }
        },
        /* greeting */
        greeting: (params) => {
          /* Arguments */
          const args: Argument[] = [arg('input', 'Greeting!', params.input)]
          /* Selection */
          const field = leaf('greeting', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('greeting')(field.hash!),
              )
          }
        },
        /* whoami */
        whoami: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('whoami', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('whoami')(field.hash!),
              )
          }
        },
      }
      return selector(types)
    }
    return selection(decoder, OperationType.Query)
  },
}

export const unions = {
  characterUnion: <T>(
    selector: (fields: Documentation['CharacterUnion']) => T,
  ): SelectionSet<Union['CharacterUnion'], T> => {
    const decoder = (fields: Fields<Union['CharacterUnion']>): T => {
      const types: Documentation['CharacterUnion'] = {
        on: <T>(selectors: {
          human: SelectionSet<Object['Human'], T>
          droid: SelectionSet<Object['Droid'], T>
        }) => {
          /* Selection */
          fields.select(fragment('Human', selectors.human.fields))
          fields.select(fragment('Droid', selectors.droid.fields))

          /* Mock & Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selectors.human.mock
            case 'fetched':
              switch (data.response.typename) {
                case 'Human':
                  return selectors.human.decode(data.response.raw())
                case 'Droid':
                  return selectors.droid.decode(data.response.raw())
                default:
                  throw new Error(`Unknown type ${data.response.typename}`)
              }
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
}

export const interfaces = {
  character: <T>(
    selector: (fields: Documentation['Character']) => T,
  ): SelectionSet<Interface['Character'], T> => {
    const decoder = (fields: Fields<Interface['Character']>): T => {
      const types: Documentation['Character'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('id', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['ID']
            case 'fetched':
              return ScalarDecoder.ID(data.response.get('id')(field.hash!))
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          /* Selection */
          const field = leaf('name', args)
          fields.select(field)
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return ScalarMock['String']
            case 'fetched':
              return ScalarDecoder.String(
                data.response.get('name')(field.hash!),
              )
          }
        },
        on: <T>(selectors: {
          droid: SelectionSet<Object['Droid'], T>
          human: SelectionSet<Object['Human'], T>
        }) => {
          /* Selection */
          fields.select(fragment('Droid', selectors.droid.fields))
          fields.select(fragment('Human', selectors.human.fields))

          /* Mock & Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return selectors.droid.mock
            case 'fetched':
              switch (data.response.typename) {
                case 'Droid':
                  return selectors.droid.decode(data.response.raw())
                case 'Human':
                  return selectors.human.decode(data.response.raw())
                default:
                  throw new Error(`Unknown type ${data.response.typename}`)
              }
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
}
