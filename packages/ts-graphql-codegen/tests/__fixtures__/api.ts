import {
  composite,
  leaf,
  fragment,
  SelectionSet,
  Fields,
  selection,
  Argument,
  hash,
  arg,
} from '../../../ts-graphql/src/__generator'

/* Scalars */
export type Scalar = {
  ID: string
  String: string
  Float: number
  Int: number
  Bool: boolean
}

/* Types */
type DroidObject = {
  __typename: 'Droid'
  id: Scalar['ID'] | null
  name: Scalar['String'] | null
  primaryFunction: Scalar['String'] | null
  appearsIn: Array<Enum['Episode'] | null> | null
}

type HumanObject = {
  __typename: 'Human'
  id: Scalar['ID'] | null
  name: Scalar['String'] | null
  homePlanet: Scalar['String'] | null
  appearsIn: Array<Enum['Episode'] | null> | null
  infoURL: Scalar['String'] | null
}

type QueryObject = {
  __typename: 'Query'
  human: Object['Human'] | null
  droid: Object['Droid'] | null
  character: Union['CharacterUnion'] | null
  luke: Object['Human'] | null
  humans: Array<Object['Human'] | null> | null
  droids: Array<Object['Droid'] | null> | null
  characters: Array<Interface['Character'] | null> | null
  greeting: Scalar['String'] | null
  whoami: Scalar['String'] | null
}

export type Object = {
  Droid: DroidObject
  Human: HumanObject
  Query: QueryObject
}

type CharacterInterface =
  | {
      __typename: 'Droid'
      id: Scalar['ID'] | null
      name: Scalar['String'] | null
      primaryFunction: Scalar['String'] | null
      appearsIn: Array<Enum['Episode'] | null> | null
    }
  | {
      __typename: 'Human'
      id: Scalar['ID'] | null
      name: Scalar['String'] | null
      homePlanet: Scalar['String'] | null
      appearsIn: Array<Enum['Episode'] | null> | null
      infoURL: Scalar['String'] | null
    }

export type Interface = {
  Character: CharacterInterface
}

type CharacterUnionUnion =
  | {
      __typename: 'Human'
      id: Scalar['ID'] | null
      name: Scalar['String'] | null
      homePlanet: Scalar['String'] | null
      appearsIn: Array<Enum['Episode'] | null> | null
      infoURL: Scalar['String'] | null
    }
  | {
      __typename: 'Droid'
      id: Scalar['ID'] | null
      name: Scalar['String'] | null
      primaryFunction: Scalar['String'] | null
      appearsIn: Array<Enum['Episode'] | null> | null
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

export type Enum = {
  Episode: EpisodeEnum
  Language: LanguageEnum
}

type GreetingInputObject = {
  language: Enum['Language'] | null | undefined
  name: Scalar['String'] | null | undefined
}

type GreetingOptionsInputObject = {
  prefix: Scalar['String'] | null | undefined
}

export type InputObject = {
  Greeting: GreetingInputObject
  GreetingOptions: GreetingOptionsInputObject
}

/* Documentation */
type Documentation = {
  Droid: {
    id: () => Scalar['ID'] | null
    name: () => Scalar['String'] | null
    primaryFunction: () => Scalar['String'] | null
    appearsIn: () => Array<Enum['Episode'] | null> | null
  }
  Human: {
    id: () => Scalar['ID'] | null
    name: () => Scalar['String'] | null
    homePlanet: () => Scalar['String'] | null
    appearsIn: () => Array<Enum['Episode'] | null> | null
    infoUrl: () => Scalar['String'] | null
  }
  Query: {
    human: (params: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Object['Human'] | null | undefined, T>,
    ) => T
    droid: (params: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Object['Droid'] | null | undefined, T>,
    ) => T
    character: (params: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Union['CharacterUnion'] | null | undefined, T>,
    ) => T
    luke: <T>(
      selection: SelectionSet<Object['Human'] | null | undefined, T>,
    ) => T
    humans: <T>(
      selection: SelectionSet<
        Array<Object['Human'] | null | undefined> | null | undefined,
        T
      >,
    ) => T
    droids: <T>(
      selection: SelectionSet<
        Array<Object['Droid'] | null | undefined> | null | undefined,
        T
      >,
    ) => T
    characters: <T>(
      selection: SelectionSet<
        Array<Interface['Character'] | null | undefined> | null | undefined,
        T
      >,
    ) => T
    greeting: (params: {
      input: InputObject['Greeting'] | null
    }) => Scalar['String'] | null
    whoami: () => Scalar['String'] | null
  }
  Character: {
    id: () => Scalar['ID'] | null
    name: () => Scalar['String'] | null
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
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('id', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('id')(argsHash)
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('name', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('name')(argsHash)
          }
        },
        /* primaryFunction */
        primaryFunction: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('primaryFunction', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('primaryFunction')(argsHash)
          }
        },
        /* appearsIn */
        appearsIn: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('appearsIn', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('appearsIn')(argsHash)
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
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('id', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('id')(argsHash)
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('name', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('name')(argsHash)
          }
        },
        /* homePlanet */
        homePlanet: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('homePlanet', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('homePlanet')(argsHash)
          }
        },
        /* appearsIn */
        appearsIn: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('appearsIn', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('appearsIn')(argsHash)
          }
        },
        /* infoUrl */
        infoUrl: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('infoURL', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('infoURL')(argsHash)
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
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('human', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('human')(argsHash))
          }
        },
        /* droid */
        droid: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('droid', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('droid')(argsHash))
          }
        },
        /* character */
        character: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('character', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('character')(argsHash))
          }
        },
        /* luke */
        luke: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('luke', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('luke')(argsHash))
          }
        },
        /* humans */
        humans: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('humans', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('humans')(argsHash))
          }
        },
        /* droids */
        droids: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('droids', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('droids')(argsHash))
          }
        },
        /* characters */
        characters: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(composite('characters', selection.fields, args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return selection.decode(data.response.get('characters')(argsHash))
          }
        },
        /* greeting */
        greeting: (params) => {
          /* Arguments */
          const args: Argument[] = [arg('input', 'Greeting', params.input)]
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('greeting', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('greeting')(argsHash)
          }
        },
        /* whoami */
        whoami: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('whoami', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('whoami')(argsHash)
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
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
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('id', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('id')(argsHash)
          }
        },
        /* name */
        name: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)
          /* Selection */
          fields.select(leaf('name', args))
          /* Mock & Decoder */

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return null
            case 'fetched':
              return data.response.get('name')(argsHash)
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
