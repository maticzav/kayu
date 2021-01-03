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
} from 'ts-graphql/src/__generator'

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

/* Field Types */
type FieldsTypes = {
  Droid: {
    id: () => Object['Droid'] | null
    name: () => Object['Droid'] | null
    primaryFunction: () => Object['Droid'] | null
    appearsIn: () => Array<Object['Droid'] | null> | null
  }
  Human: {
    id: () => Object['Human'] | null
    name: () => Object['Human'] | null
    homePlanet: () => Object['Human'] | null
    appearsIn: () => Array<Object['Human'] | null> | null
    infoUrl: () => Object['Human'] | null
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
    }) => Object['Query'] | null
    whoami: () => Object['Query'] | null
  }
}

/* Selections */
export const objects = {
  droid: <T>(
    selector: (fields: FieldsTypes['Droid']) => T,
  ): SelectionSet<Object['Droid'], T> => {
    const decoder = (fields: Fields<Object['Droid']>): T => {
      const types: FieldsTypes['Droid'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          fields.select(leaf('id', args))
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
    selector: (fields: FieldsTypes['Human']) => T,
  ): SelectionSet<Object['Human'], T> => {
    const decoder = (fields: Fields<Object['Human']>): T => {
      const types: FieldsTypes['Human'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          fields.select(leaf('id', args))
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
    selector: (fields: FieldsTypes['Query']) => T,
  ): SelectionSet<Object['Query'], T> => {
    const decoder = (fields: Fields<Object['Query']>): T => {
      const types: FieldsTypes['Query'] = {
        /* human */
        human: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Object['Human'] | null>()
          let mock = null
          fields.select(composite('human', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Human'] | null>(
                data.response.get('human')(argsHash),
              )
              return selection.decoder(datasubfields)
          }
        },
        /* droid */
        droid: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Object['Droid'] | null>()
          let mock = null
          fields.select(composite('droid', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Droid'] | null>(
                data.response.get('droid')(argsHash),
              )
              return selection.decoder(datasubfields)
          }
        },
        /* character */
        character: (params) => (selection) => {
          /* Arguments */
          const args: Argument[] = [arg('id', 'ID!', params.id)]
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Union['CharacterUnion'] | null>()
          let mock = null
          fields.select(composite('character', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Union['CharacterUnion'] | null>(
                data.response.get('character')(argsHash),
              )
              return selection.decoder(datasubfields)
          }
        },
        /* luke */
        luke: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Object['Human'] | null>()
          let mock = null
          fields.select(composite('luke', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Human'] | null>(
                data.response.get('luke')(argsHash),
              )
              return selection.decoder(datasubfields)
          }
        },
        /* humans */
        humans: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Array<Object['Human'] | null> | null>()
          let mock = null
          fields.select(composite('humans', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Array<
                Object['Human'] | null
              > | null>(data.response.get('humans')(argsHash))
              return selection.decoder(datasubfields)
          }
        },
        /* droids */
        droids: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Array<Object['Droid'] | null> | null>()
          let mock = null
          fields.select(composite('droids', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Array<
                Object['Droid'] | null
              > | null>(data.response.get('droids')(argsHash))
              return selection.decoder(datasubfields)
          }
        },
        /* characters */
        characters: (selection) => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          let subfields = new Fields<Array<
            Interface['Character'] | null
          > | null>()
          let mock = null
          fields.select(composite('characters', subfields.selection, args))

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Array<
                Interface['Character'] | null
              > | null>(data.response.get('characters')(argsHash))
              return selection.decoder(datasubfields)
          }
        },
        /* greeting */
        greeting: (params) => {
          /* Arguments */
          const args: Argument[] = [arg('input', 'Greeting', params.input)]
          const argsHash = hash(args)

          /* Selection */
          fields.select(leaf('greeting', args))
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
    selector: (fields: FieldsTypes['CharacterUnion']) => T,
  ): SelectionSet<Union['CharacterUnion'], T> => {
    const decoder = (fields: Fields<Union['CharacterUnion']>): T => {
      const types: FieldsTypes['CharacterUnion'] = {}
      return selector(types)
    }
    return selection(decoder)
  },
}

export const interfaces = {
  character: <T>(
    selector: (fields: FieldsTypes['Character']) => T,
  ): SelectionSet<Interface['Character'], T> => {
    const decoder = (fields: Fields<Interface['Character']>): T => {
      const types: FieldsTypes['Character'] = {
        /* id */
        id: () => {
          /* Arguments */
          const args: Argument[] = []
          const argsHash = hash(args)

          /* Selection */
          fields.select(leaf('id', args))
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
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
          let mock = null

          /* Decoder */
          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response.get('name')(argsHash)
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
}
