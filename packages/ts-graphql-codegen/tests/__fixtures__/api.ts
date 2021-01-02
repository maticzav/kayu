import {
  composite,
  leaf,
  fragment,
  SelectionSet,
  Fields,
  selection,
} from 'ts-graphql/src/__generator'

/* Scalars */
export type Scalar = {
  ID: string
  String: string
  Float: number
  Int: number
  Bool: boolean
}

/* Objects */
type DroidObject = {
  id: Scalar['ID'] | null
  name: Scalar['String'] | null
  primaryFunction: Scalar['String'] | null
  appearsIn: (Enum['Episode'] | null)[] | null
}

type HumanObject = {
  id: Scalar['ID'] | null
  name: Scalar['String'] | null
  homePlanet: Scalar['String'] | null
  appearsIn: (Enum['Episode'] | null)[] | null
  infoURL: Scalar['String'] | null
}

type QueryObject = {
  human: Object['Human'] | null
  droid: Object['Droid'] | null
  character: Union['CharacterUnion'] | null
  luke: Object['Human'] | null
  humans: (Object['Human'] | null)[] | null
  droids: (Object['Droid'] | null)[] | null
  characters: (Interface['Character'] | null)[] | null
  greeting: Scalar['String'] | null
  whoami: Scalar['String'] | null
}

export type Object = {
  Droid: DroidObject
  Human: HumanObject
  Query: QueryObject
}

/* Enums */
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

/* Input Objects */
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
    id: () => Scalar['ID'] | null
    name: () => Scalar['String'] | null
    primaryFunction: () => Scalar['String'] | null
    appearsIn: () => (Enum['Episode'] | null)[] | null
  }
  Human: {
    id: () => Scalar['ID'] | null
    name: () => Scalar['String'] | null
    homePlanet: () => Scalar['String'] | null
    appearsIn: () => (Enum['Episode'] | null)[] | null
    infoURL: () => Scalar['String'] | null
  }
  Query: {
    human: (args: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Object['Human'] | null | undefined, T>,
    ) => T
    droid: (args: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Object['Droid'] | null | undefined, T>,
    ) => T
    character: (args: {
      id: Scalar['ID']
    }) => <T>(
      selection: SelectionSet<Union['CharacterUnion'] | null | undefined, T>,
    ) => T
    luke: <T>(
      selection: SelectionSet<Object['Human'] | null | undefined, T>,
    ) => T
    humans: <T>(
      selection: SelectionSet<
        (Object['Human'] | null | undefined)[] | null | undefined,
        T
      >,
    ) => T
    droids: <T>(
      selection: SelectionSet<
        (Object['Droid'] | null | undefined)[] | null | undefined,
        T
      >,
    ) => T
    characters: <T>(
      selection: SelectionSet<
        (Interface['Character'] | null | undefined)[] | null | undefined,
        T
      >,
    ) => T
    greeting: (args: {
      input: InputObject['Greeting'] | null
    }) => Scalar['String'] | null
    whoami: () => Scalar['String'] | null
  }
}

/* Selections */
export const objects = {
  droid: <T>(
    selector: (fields: FieldsTypes['Droid']) => T,
  ): SelectionSet<Object['Droid'], T> => {
    const decoder = (fields: Fields<Object['Droid']>): T => {
      const types: FieldsTypes['Droid'] = {
        id: () => {
          fields.select(leaf('id'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['id']
          }
        },
        name: () => {
          fields.select(leaf('name'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['name']
          }
        },
        primaryFunction: () => {
          fields.select(leaf('primaryFunction'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['primaryFunction']
          }
        },
        appearsIn: () => {
          fields.select(leaf('appearsIn'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['appearsIn']
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
        id: () => {
          fields.select(leaf('id'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['id']
          }
        },
        name: () => {
          fields.select(leaf('name'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['name']
          }
        },
        homePlanet: () => {
          fields.select(leaf('homePlanet'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['homePlanet']
          }
        },
        appearsIn: () => {
          fields.select(leaf('appearsIn'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['appearsIn']
          }
        },
        infoUrl: () => {
          fields.select(leaf('infoURL'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['infoURL']
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
        human: (args) => (selection) => {
          let subfields = new Fields<Object['Human']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('human', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Human']>(
                data.response['human'],
              )
              return selection.decoder(datasubfields)
          }
        },
        droid: (args) => (selection) => {
          let subfields = new Fields<Object['Droid']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('droid', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Droid']>(
                data.response['droid'],
              )
              return selection.decoder(datasubfields)
          }
        },
        character: (args) => (selection) => {
          let subfields = new Fields<Union['CharacterUnion']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('character', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Union['CharacterUnion']>(
                data.response['character'],
              )
              return selection.decoder(datasubfields)
          }
        },
        luke: (selection) => {
          let subfields = new Fields<Object['Human']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('luke', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Human']>(
                data.response['luke'],
              )
              return selection.decoder(datasubfields)
          }
        },
        humans: (selection) => {
          let subfields = new Fields<Object['Human']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('humans', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Human']>(
                data.response['humans'],
              )
              return selection.decoder(datasubfields)
          }
        },
        droids: (selection) => {
          let subfields = new Fields<Object['Droid']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('droids', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Object['Droid']>(
                data.response['droids'],
              )
              return selection.decoder(datasubfields)
          }
        },
        characters: (selection) => {
          let subfields = new Fields<Interface['Character']>()
          let mock = selection.decoder(subfields)
          fields.select(composite('characters', subfields.selection))

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              let datasubfields = new Fields<Interface['Character']>(
                data.response['characters'],
              )
              return selection.decoder(datasubfields)
          }
        },
        greeting: (args) => {
          fields.select(leaf('greeting'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['greeting']
          }
        },
        whoami: () => {
          fields.select(leaf('whoami'))
          let mock = ''

          const data = fields.data
          switch (data.type) {
            case 'fetching':
              return mock
            case 'fetched':
              return data.response['whoami']
          }
        },
      }
      return selector(types)
    }
    return selection(decoder)
  },
}
