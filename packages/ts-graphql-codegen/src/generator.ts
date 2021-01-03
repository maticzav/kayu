import {
  IntrospectionEnumType,
  IntrospectionField,
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionNamedTypeRef,
  IntrospectionObjectType,
  IntrospectionScalarType,
  IntrospectionSchema,
  IntrospectionTypeRef,
  IntrospectionUnionType,
} from 'graphql'
import * as prettier from 'prettier'
import * as os from 'os'

import { getNamedTypeRef, invert } from './ast'
import { wrap, wrapGraphQLSDL } from './refs'
import { camel, defined, pascal } from './utils'

type ScalarMap = Map<string, string>

/**
 * GQLGenerator generates the code that developers use to make
 * selections and provides type-safe query creation.
 *
 * It consists of a couple intertwined pieces that each represent
 * a different scope of the GraphQL schema.
 *  Firstly, each GraphQL type (e.g. scalar, object, enum...) gets an
 * indexed reference that other code references in its delarations.
 *  Secondly, we collect all possible function definitions in FieldTypes
 * type structure and reference it from `objects`, `interfaces` and `unions`
 * seleciton objects.
 */
export class GQLGenerator {
  /* State */

  private scalarMappings: ScalarMap
  private schema: IntrospectionSchema
  private prettierConfiguration: Omit<prettier.Options, 'parser'>

  /* Initializer */

  constructor(
    schema: IntrospectionSchema,
    scalars: ScalarMap,
    prettier: Omit<prettier.Options, 'parser'> = {},
  ) {
    this.scalarMappings = scalars
    this.schema = schema
    this.prettierConfiguration = prettier
  }

  /* Scalars */

  /**
   * Returns the mapped value of a scalar.
   */
  private scalar(type: string): string {
    if (this.scalarMappings.has(type)) {
      return this.scalarMappings.get(type)!
    }
    throw new Error(`Unknown scalar "${type}".`)
  }

  /* Schema Accessors */

  /**
   * Returns all the scalar types in the schema.
   */
  scalars(): IntrospectionScalarType[] {
    let scalars: IntrospectionScalarType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'SCALAR': {
          scalars.push(type)
        }
      }
    }

    return scalars
  }

  /**
   * Tries to find an object with given name in the schema.
   */
  object(name: string): IntrospectionObjectType | undefined {
    /**
     * We traverse through all the types and try to find
     * the one with a given name.
     */
    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'OBJECT': {
          if (type.name === name) {
            return type
          }
        }
      }
    }
    return undefined
  }

  /**
   * Returns all the objects in schema.
   */
  objects(): IntrospectionObjectType[] {
    let objects: IntrospectionObjectType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'OBJECT': {
          // Not built-in type.
          if (!type.name.startsWith('__')) {
            objects.push(type)
          }
        }
      }
    }

    return objects
  }

  /**
   * Returns all the objects in schema.
   */
  unions(): IntrospectionUnionType[] {
    let unions: IntrospectionUnionType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'UNION': {
          // Not built-in type.
          if (!type.name.startsWith('__')) {
            unions.push(type)
          }
        }
      }
    }

    return unions
  }

  /**
   * Returns all the enums in the schema.
   */
  enums(): IntrospectionEnumType[] {
    let enums: IntrospectionEnumType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'ENUM': {
          // Not built-in type.
          if (!type.name.startsWith('__')) {
            enums.push(type)
          }
        }
      }
    }

    return enums
  }

  /**
   * Returns all the interfaces in the schema.
   */
  interfaces(): IntrospectionInterfaceType[] {
    let interfaces: IntrospectionInterfaceType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'INTERFACE': {
          // Not built-in type.
          if (!type.name.startsWith('__')) {
            interfaces.push(type)
          }
        }
      }
    }

    return interfaces
  }

  /**
   * Returns all the input objects in the schema.
   */
  inputObjects(): IntrospectionInputObjectType[] {
    let inputObjects: IntrospectionInputObjectType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'INPUT_OBJECT': {
          // Not built-in type.
          if (!type.name.startsWith('__')) {
            inputObjects.push(type)
          }
        }
      }
    }

    return inputObjects
  }

  /* Generator */

  /**
   * Generates the library.
   */
  generate(): string {
    /* Generates chunks of code */
    const code = [
      /* Imports */
      ...this.generateImports(),
      /* Type Index */
      os.EOL,
      '/* Scalars */',
      ...this.generateScalars(),
      os.EOL,
      '/* Types */',
      ...this.generateObjectTypes(),
      os.EOL,
      ...this.generateInterfaceTypes(),
      os.EOL,
      ...this.generateUnionTypes(),
      os.EOL,
      ...this.generateEnums(),
      os.EOL,
      ...this.generateInputObjects(),
      /* Field types */
      os.EOL,
      '/* Field Types */',
      ...this.generateFieldTypes(),
      /* Selections */
      os.EOL,
      '/* Selections */',
      ...this.generateObjects(),
      os.EOL,
      ...this.generateUnions(),
      os.EOL,
      ...this.generateInterfaces(),
    ].join(os.EOL)

    /* Formats the code. */

    const prettified = prettier.format(code, {
      parser: 'typescript',
      ...this.prettierConfiguration,
    })

    return prettified
  }

  /**
   * Generates imports that library needs.
   */
  generateImports(): string[] {
    return [
      "import { composite, leaf, fragment, SelectionSet, Fields, selection, Argument, hash, arg } from 'ts-graphql/src/__generator'",
    ]
  }

  /**
   * Generates index of scalar types the generated code uses.
   */
  generateScalars(): string[] {
    let code: string[] = []

    code.push('export type Scalar = {')
    /* BuiltIn Types */
    code.push(`ID: string`)
    code.push(`String: string`)
    code.push(`Float: number`)
    code.push(`Int: number`)
    code.push(`Bool: boolean`)
    /* Custom Scalars */
    for (const type in this.scalarMappings) {
      const mapping = this.scalarMappings.get(type)!
      code.push(`${type}: ${mapping}`)
    }
    /* End */
    code.push('}')

    return code
  }

  /**
   * Object type holds information about all return object types from
   * the schema and their identifiers that we use as a reference for TypeLocks.
   *
   * We predefine identifiers to get better error messages and type
   * annotations by the IDE.
   */
  generateObjectTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const object of this.objects()) {
      const name = pascal(object.name)
      const id = `${name}Object`

      // Make a checkmark in the index.
      index.push(`${name}: ${id}`)

      /**
       * Name the type and add the definition.
       */
      code.push(`type ${id} =`)
      code.push(...this.generateObjectType(object))
    }

    /**
     * Generate index at the end.
     */
    code.push(`export type Object = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * Interface type holds information about all return interface types from
   * the schema and their identifiers that we use as a reference for TypeLocks.
   *
   * We predefine identifiers to get better error messages and type
   * annotations by the IDE.
   */
  generateInterfaceTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const interfac of this.interfaces()) {
      const name = pascal(interfac.name)
      const id = `${name}Interface`

      // Make a checkmark in the index.
      index.push(`${name}: ${id}`)

      /**
       * Name the interface type and add multiple definitions
       * of each implementing type.
       */
      code.push(`type ${id} =`)

      for (const { name } of interfac.possibleTypes) {
        const object = this.object(name)!
        code.push(...this.generateObjectType(object))
      }
    }

    /**
     * Generate index at the end.
     */
    code.push(`export type Interface = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * Interface type holds information about all interface return types from
   * the schema and their identifiers that we use as a reference for TypeLocks.
   *
   * We predefine identifiers to get better error messages and type
   * annotations by the IDE.
   */
  generateUnionTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const union of this.unions()) {
      const name = pascal(union.name)
      const id = `${name}Union`

      // Make a checkmark in the index.
      index.push(`${name}: ${id}`)

      /**
       * Name the union type and add multiple definitions
       * of each implementing type.
       */
      code.push(`type ${id} =`)

      for (const { name } of union.possibleTypes) {
        const object = this.object(name)!
        code.push(...this.generateObjectType(object))
      }
    }

    /**
     * Generate index at the end.
     */
    code.push(`export type Union = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * A utility function that generates an object type. We use it
   * in object types generator function, interface and union type
   * generators.
   *
   * It generates a type without a name.
   */
  generateObjectType(object: IntrospectionObjectType): string[] {
    let code: string[] = []

    code.push(`| {`)
    code.push(`__typename: "${object.name}"`)
    for (const field of object.fields) {
      /**
       * - type contains the unwrapped indexed typed
       * - ref is the whole type that we use to calculate wrapper
       */
      const fieldName = field.name
      const fieldType = this.getTypeMapping(getNamedTypeRef(field.type))
      const fieldRef = field.type

      code.push(`${fieldName}: ${wrap(fieldType, fieldRef)}`)
    }
    code.push(`}`, os.EOL)

    return code
  }

  /**
   * Generates enumeration values to use them in the code.
   *
   * We predefine enums to get better error messages and type annotations by the IDE
   * and create an index that namespaces all the enums.
   */
  generateEnums(): string[] {
    /**
     * `code` variable represents lines of code while
     * `index` variable represents index of all enums
     * we have generated with this function.
     */
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate objects and make index references
     * as you check each of them.
     */
    for (const type of this.enums()) {
      const id = `${type.name}Enum`
      index.push(`${type.name}: ${id}`)

      code.push(`enum ${id} {`)
      for (const field of type.enumValues) {
        code.push(`${field.name} = "${field.name}",`)
      }
      code.push(`}`, os.EOL)
    }

    /**
     * Generate index using references in index variable.
     */
    code.push(`export type Enum = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * Generates all the input objects that we may use as arguments.
   */
  generateInputObjects(): string[] {
    /**
     * `code` keeps track of all lines of code,
     * `index` keeps track of all created input objects so we can make an index.
     */
    let code: string[] = []
    let index: string[] = []

    /**
     * Generates an input object for each of input objects in the schema.
     */
    for (const object of this.inputObjects()) {
      const id = `${object.name}InputObject`

      // Make a reference in index.
      index.push(`${object.name}: ${id}`)

      code.push(`type ${id} = {`)

      /**
       * Get named type from reference and wrap it based on
       * the reference. `true` in `wrap` indicates that nullable
       * values may be omitted.
       */
      for (const field of object.inputFields) {
        const type = this.getTypeMapping(getNamedTypeRef(field.type))
        const ref = field.type

        code.push(`${field.name}: ${wrap(type, ref, true)}`)
      }

      code.push('}', os.EOL)
    }

    /**
     * Generate the index.
     */
    code.push('export type InputObject = {')
    code.push(...index)
    code.push('}')

    return code
  }

  /* Field Types */

  /**
   * FieldTypes represent all the possible fields user may use to make a selection in a given type.
   * This function creates a type-dictionary of these fields (i.e. for each type in the schema one branch).
   */
  generateFieldTypes(): string[] {
    let code: string[] = []

    code.push('type FieldsTypes = {')

    /**
     * Examine each type in the schema and push the selection to the code.
     */
    for (const type of this.objects()) {
      code.push(`${type.name}: {`)

      /**
       * Generate appropriate field definition for each field in a type.
       * Each function may accept a selection, arguments or both.
       *
       * We make sure that we always generate a function, even if it's a thunk.
       */
      for (const field of type.fields) {
        let chunks: string[] = []

        const fieldName = camel(field.name)
        const fieldType = getNamedTypeRef(field.type)
        const fieldRef = field.type

        // Arguments
        if (field.args.length > 0) {
          let args: string[] = []

          for (const arg of field.args) {
            /**
             * We map each argument to a given type mapping
             * that references the generated code. We use the reference
             * to produce correct (wrapped) type value.
             */
            const argType = this.getTypeMapping(getNamedTypeRef(arg.type))
            const argRef = arg.type

            args.push(`${arg.name}: ${wrap(argType, argRef)}`)
          }

          chunks.push(`(params: { ${args.join(', ')} })`)
        }

        // Selection
        switch (fieldType.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT':
            /**
             * We defer unwrapping of values to developer land
             * and only make sure that the return type (i.e. typelock) here
             * matches the return value of the field.
             *
             * The `true` in wrapper indicates that nullable fields may be ommitted.
             */
            const fieldTypeMapping = this.getTypeMapping(fieldType)
            const typelock = wrap(fieldTypeMapping, fieldRef, true)

            chunks.push(`<T>(selection: SelectionSet<${typelock}, T>)`)
            break
          /* Value Types */
          case 'SCALAR':
          case 'ENUM':
            // Create a thunk if there's no parameters yet.
            if (chunks.length === 0) {
              chunks.push('()')
            }
            break
          /* Throw on unhandled. */
          default: {
            throw new Error(`Unhandled case ${fieldType.kind}.`)
          }
        }

        // Return type
        switch (fieldType.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT':
            chunks.push('T')
            break

          /* Value Types */
          case 'SCALAR':
          case 'ENUM':
            chunks.push(wrap(this.getTypeMapping(type), fieldRef))

            break
          /* Throw on unhandled. */
          default: {
            throw new Error(`Unhandled case ${fieldType.kind}.`)
          }
        }

        /**
         * We merge the chunks into a single function declaration string.
         */
        const fn: string = chunks
          .filter((chunk) => defined<string>(chunk))
          .join(' => ')
        code.push(`${fieldName}: ${fn}`)
      }

      code.push('}')
    }

    code.push('}')

    return code
  }

  /**
   * Generates a selection of functions that developers may
   * use to create selections. It's complemented by FieldTypes that
   * holds information about the functions and by ObjectTypes that contain
   * information about the return types of queries.
   */
  generateObjects(): string[] {
    /**
     * `code` contains lines of code.
     */
    let code: string[] = []

    code.push('export const objects = {')

    /**
     * We camel-case each object type and create a selector for it.
     */
    for (const object of this.objects()) {
      const typeField = camel(object.name)
      const typeName = pascal(object.name)

      /* Selector  */
      /* prettier-ignore */
      code.push(`${typeField}: <T>(selector: (fields: FieldsTypes['${typeName}']) => T): SelectionSet<Object['${typeName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Object['${typeName}']>): T => {`)

      /* Types */
      code.push(`const types: FieldsTypes['${typeName}'] = {`)

      /**
       * We generate a selection function for every field in the object.
       */
      for (const field of object.fields) {
        code.push(...this.generateField(field))
      }

      code.push('}')
      /* Ends types */

      code.push('return selector(types)')
      code.push('}')
      /* Ends decoder */

      code.push('return selection(decoder)')
      code.push('},')
      /* Ends selector */
    }

    code.push('}')

    return code
  }

  /**
   * Generates interfaces selection functions.
   */
  generateInterfaces(): string[] {
    /**
     * `code` contains lines of code.
     */
    let code: string[] = []

    code.push('export const interfaces = {')

    /**
     * We camel-case each interface type and create a selector for it.
     */
    for (const interfac of this.interfaces()) {
      const interfaceField = camel(interfac.name)
      const interfaceName = pascal(interfac.name)

      /* Selector */
      /* prettier-ignore */
      code.push(`${interfaceField}: <T>(selector: (fields: FieldsTypes['${interfaceName}']) => T): SelectionSet<Interface['${interfaceName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Interface['${interfaceName}']>): T => {`)

      /* Types */
      code.push(`const types: FieldsTypes['${interfaceName}'] = {`)

      /**
       * We generate a selection function for every field in the interface,
       * and make a fragment selection on possible types.
       */
      for (const field of interfac.fields) {
        code.push(...this.generateField(field))
      }
      this.generateFragments(interfac.possibleTypes)

      code.push('}')
      /* Ends types */

      code.push('return selector(types)')
      code.push('}')
      /* Ends decoder */

      code.push('return selection(decoder)')
      code.push('},')
      /* Ends selector */
    }

    code.push('}')

    return code
  }

  /**
   * Generates union selection functions.
   */
  generateUnions(): string[] {
    /**
     * `code` contains lines of code.
     */
    let code: string[] = []

    code.push('export const unions = {')

    /**
     * We camel-case each interface type and create a selector for it.
     */
    for (const union of this.unions()) {
      const unionField = camel(union.name)
      const unionName = pascal(union.name)

      /* Selector  */
      /* prettier-ignore */
      code.push(`${unionField}: <T>(selector: (fields: FieldsTypes['${unionName}']) => T): SelectionSet<Union['${unionName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Union['${unionName}']>): T => {`)

      /* Types */
      code.push(`const types: FieldsTypes['${unionName}'] = {`)

      /**
       * Union types only have `on` function and we add it here as
       * a fragment selection.
       */
      this.generateFragments(union.possibleTypes)

      code.push('}')
      /* Ends types */

      code.push('return selector(types)')
      code.push('}')
      /* Ends decoder */

      code.push('return selection(decoder)')
      code.push('},')
      /* Ends selector */
    }

    code.push('}')

    return code
  }

  /**
   * Utility function used to generate field selections. We use it in interface
   * and object generator functions.
   */
  generateField(field: IntrospectionField): string[] {
    let code: string[] = []

    /**
     * Each field has a set of values that we reuse in each of the
     * steps below. `fieldName` represents the internal name of the field (i.e. the one used in generated code),
     * `fieldType` represents the named type of the field, `fieldRef` represents the type with the whole reference,
     * and `fieldTypeName` represents the mapped instance that is wrapped according
     * to typeRef.
     */
    const fieldName = camel(field.name)
    const fieldType = getNamedTypeRef(field.type)
    const fieldRef = field.type
    const fieldTypeName = wrap(this.getTypeMapping(fieldType), fieldRef)

    // Make code more readable by adding a comment note.
    code.push(`/* ${fieldName} */`)

    /**
     * First, we build function definition - that is the
     * arguments and everything that funciton needs to work
     * as expected.
     *
     * We want to make sure that a function (in TS-land) always has at least one
     * argument and no more than is needed.
     */
    let definition: string[] = []

    if (field.args.length > 0) {
      definition.push('(params)')
    }

    switch (fieldType.kind) {
      case 'UNION':
      case 'INTERFACE':
      case 'OBJECT':
        definition.push('(selection)')
        break

      case 'SCALAR':
      case 'ENUM':
        // Create a thunk if there's no parameters yet.
        if (definition.length === 0) {
          definition.push('()')
        }
    }

    definition.push('{')

    code.push(`${fieldName}: ${definition.join(' => ')}`)

    /**
     * Secondly, we generate arguments selection and arguments hashing
     * function.
     *
     * We extract the arguments from args parameter if it exists and turn it into
     * list of Argument definitions that our library understands.
     */
    code.push(`/* Arguments */`)
    code.push(`const args: Argument[] = [`)

    for (const arg of field.args) {
      const argName = camel(arg.name)
      const argRef = arg.type
      const argTypeName = getNamedTypeRef(arg.type).name
      const argType = wrapGraphQLSDL(argTypeName, argRef)

      code.push(`arg("${arg.name}", "${argType}", params.${argName})`)
    }

    code.push(`]`)

    // Hash function
    code.push(`const argsHash = hash(args)`)

    /**
     * Thirdly, we generate selection.
     *
     * Selection makes a note in the fields object that ts-graphql
     * uses behind the scenes to generate the GraphQL query. We also
     * define the mock value here that we use while running the selector
     * without return values.
     */
    const mockValue = this.getTypeMock(fieldRef)

    switch (fieldType.kind) {
      /* Selection Types */
      case 'UNION':
      case 'INTERFACE':
      case 'OBJECT':
        /* prettier-ignore */
        code.push(/* ts */ `
              /* Selection */
              let subfields = new Fields<${fieldTypeName}>()
              let mock = ${mockValue}
              fields.select(composite('${field.name}', subfields.selection, args))
            `)

        break

      /* Value Types */
      case 'SCALAR':
      case 'ENUM':
        /**
         * We use mocking function from utility functions to get the mock value.
         */
        /* prettier-ignore */
        code.push(/* ts */ `
              /* Selection */
              fields.select(leaf('${field.name}', args))
              let mock = ${mockValue}
            `)

        break
      /* Throw on unknown. */
      default: {
        throw new Error(`Unhandled fieldType ${fieldType.kind}`)
      }
    }

    /**
     * Lastly, we generate response decoders that will spit the
     * value from the response. Response may be of two different states.
     *
     * It's either
     *  - fetching: meaning we are running the script to get selection, or
     *  - fetched: meaning we have received the response and are
     * trying to decode it.
     */
    switch (fieldType.kind) {
      /* Selection Types */
      case 'UNION':
      case 'INTERFACE':
      case 'OBJECT':
        /* prettier-ignore */
        code.push(/* ts */ `
              /* Decoder */
              const data = fields.data
              switch (data.type) {
                case 'fetching':
                  return mock
                case 'fetched':
                  let datasubfields = new Fields<${fieldTypeName}>(data.response.get("${field.name}")(argsHash))
                  return selection.decoder(datasubfields)
              }
            `)

        break
      /* Value Types */
      case 'SCALAR':
      case 'ENUM':
        /* prettier-ignore */
        code.push(/* ts */ `
              /* Decoder */
              const data = fields.data
              switch (data.type) {
                case 'fetching':
                  return mock
                case 'fetched':
                  return data.response.get("${field.name}")(argsHash)
              }
            `)

        break
      /* Throw on unknown. */
      default: {
        throw new Error(
          `Unhandled field kind ${fieldType.kind} in field decoders.`,
        )
      }
    }

    code.push('},')

    return code
  }

  /**
   * This function is a utility function for union and fragment
   * types. It generates fragment selections that developer may access
   * using `on` function.
   */
  generateFragments(
    types: readonly IntrospectionNamedTypeRef<IntrospectionObjectType>[],
  ): string[] {
    return []
  }

  /* Utility functions */

  /**
   * Returns the mapping to a given type in generated code.
   * We use this as a central point to document indexes.
   */
  getTypeMapping(type: IntrospectionNamedTypeRef): string {
    const typeName = pascal(type.name)

    switch (type.kind) {
      case 'ENUM':
        return `Enum['${typeName}']`
      case 'OBJECT':
        return `Object['${typeName}']`
      case 'SCALAR':
        return `Scalar['${type.name}']`
      case 'INPUT_OBJECT':
        return `InputObject['${typeName}']`
      case 'INTERFACE':
        return `Interface['${typeName}']`
      case 'UNION':
        return `Union['${typeName}']`
    }
  }

  /**
   * Returns the mock value for a given type ref.
   * We always default to bare minimum to get typesystem working.
   */
  getTypeMock(ref: IntrospectionTypeRef): string {
    const iref = invert(ref)

    switch (iref.kind) {
      /* Nullables & List */
      case 'NULLABLE':
        return 'null'
      /* List */
      case 'LIST':
        return '[]'
      /* Named */
      case 'ENUM':
        const id = `${pascal(iref.name)}Enum`
        return `Object.values(${id})[0]!`
      case 'SCALAR':
        const scalar = this.scalar(iref.name)
        return `${scalar}.mock`
      /* Selections */
      case 'UNION':
      case 'OBJECT':
      case 'INTERFACE':
        return 'selection.decoder(subfields)'

      /* Missing */
      default: {
        throw new Error(`Unknown reference type mock ${ref.kind}`)
      }
    }
  }
}
