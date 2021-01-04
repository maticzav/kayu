import {
  IntrospectionEnumType,
  IntrospectionField,
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionNamedTypeRef,
  IntrospectionObjectType,
  IntrospectionScalarType,
  IntrospectionSchema,
  IntrospectionType,
  IntrospectionTypeRef,
  IntrospectionUnionType,
} from 'graphql'
import * as prettier from 'prettier'
import * as os from 'os'

import {
  getNamedTypeRef,
  IntrospectionInvertedInputTypeRef,
  IntrospectionInvertedTypeRef,
  invert,
} from './ast'
import { wrap, wrapGraphQLSDL } from './refs'
import { camel, defined, pascal } from './utils'

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

export type GQLGeneratorOptions = {
  /**
   * Path to core ts-graphql module.
   */
  core: string
  /**
   * Path to codecs definitions.
   */
  codecs?: string
}
export class GQLGenerator {
  /* State */

  private schema: IntrospectionSchema
  private prettierConfiguration: Omit<prettier.Options, 'parser'>

  /* Initializer */

  constructor(
    schema: IntrospectionSchema,
    prettier: Omit<prettier.Options, 'parser'> = {},
  ) {
    this.schema = schema
    this.prettierConfiguration = prettier
  }

  /* Scalars */

  /* Schema Accessors */

  /**
   * Returns all scalar types in the schema that are not built-in
   * (i.e. it omitts ID, String, Float, Int, Boolean).
   */
  scalars(): IntrospectionScalarType[] {
    let scalars: IntrospectionScalarType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'SCALAR': {
          // Skip built-in types.
          if (
            !['ID', 'String', 'Float', 'Int', 'Boolean'].includes(type.name)
          ) {
            scalars.push(type)
          }
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

    /* istanbul ignore next */
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
          unions.push(type)
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
          interfaces.push(type)
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
          inputObjects.push(type)
        }
      }
    }

    return inputObjects
  }

  /* Generator */

  /**
   * Generates the library.
   */
  generate(opts: GQLGeneratorOptions): string {
    /* Generates chunks of code */
    const code = [
      /* Warning */
      ...this.generateWarning(),
      os.EOL,
      /* Imports */
      ...this.generateImports(opts.core),
      /* Type Index */
      os.EOL,
      '/* Scalars */',
      ...this.generateScalars(opts.codecs),
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
      /* Documentation */
      os.EOL,
      '/* Documentation */',
      ...this.generateDocumentation(),
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
   * Generates a warning about changing this file.
   */
  generateWarning(): string[] {
    return [
      '// DO NOT edit this file manually. It was auto-generated using maticzav/ts-graphql.',
    ]
  }

  /**
   * Generates imports that library needs.
   *
   * @param core - relative path to the core library that we use in generated code.
   */
  generateImports(core: string): string[] {
    return [
      `import { composite, leaf, fragment, arg, Field, Argument, SelectionSet, Fields, selection, nullable, list } from '${core}'`,
    ]
  }

  /**
   * Generates index of scalar types the generated code uses and
   * a collection of mock values indexed by scalar names.
   *
   * @param codecpath - absolute path to a given TypeScript file.
   */
  generateScalars(codecpath?: string): string[] {
    let code: string[] = []

    /**
     * If codecs path is provided, we try to import it and
     * use provided scalars in scalar map definition.
     */

    if (codecpath) {
      code.push(`import * as codecs from '${codecpath}'`)
    } else {
      if (this.scalars().length > 0) {
        console.log(`Missing Codecs definitions for custom scalar types.`)
      }
    }

    /**
     * Firstly, generate index type.
     */
    code.push('export type Scalar = {')

    // BuiltIn Types
    code.push(`ID: string`)
    code.push(`String: string`)
    code.push(`Float: number`)
    code.push(`Int: number`)
    code.push(`Boolean: boolean`)

    // Custom Scalars
    for (const scalar of this.scalars()) {
      code.push(`${scalar.name}: codecs.${scalar.name}Codec`)
    }

    /* End */
    code.push('}', os.EOL)

    /**
     * Secondly, generate mock values.
     */
    code.push('const ScalarMock = {')

    // Built-In types
    code.push(`ID: "8376",`)
    code.push(`String: "Matic Zavadlal",`)
    code.push(`Float: 3.14,`)
    code.push(`Int: 92,`)
    code.push(`Boolean: true,`)

    // Custom types.
    for (const scalar of this.scalars()) {
      code.push(`${scalar.name}: codecs.${scalar.name}Codec.mock,`)
    }

    /* End */
    code.push('}')

    /**
     * Thirdly, generate scalar decoders.
     */

    code.push('const ScalarDecoder = {')

    // Built-In types
    code.push(`ID: (val: string) => val,`)
    code.push(`String: (val: string) => val,`)
    code.push(`Float: (val: number) => val,`)
    code.push(`Int: (val: number) => val,`)
    code.push(`Bool: (val: boolean) => val,`)

    // Custom types.
    for (const scalar of this.scalars()) {
      code.push(`${scalar.name}: codecs.${scalar.name}Codec.decode,`)
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

  /* Documentation */

  /**
   * Documentation predefines all type definitions. This way, we get better IDE support and types.
   */
  generateDocumentation(): string[] {
    let code: string[] = []

    code.push('type Documentation = {')

    /**
     * We generate documentation for every type in the schema.
     * Each of them uses one of the two helper functions defined below.
     */

    /* Objects */
    for (const object of this.objects()) {
      code.push(`${object.name}: {`)

      for (const field of object.fields) {
        code.push(...this.generateFieldDocumentation(field))
      }

      code.push('}')
    }

    /* Interfaces */
    for (const interfac of this.interfaces()) {
      code.push(`${interfac.name}: {`)

      /**
       * Generate fields for common types and fragment selection
       * for possible types.
       */
      for (const field of interfac.fields) {
        code.push(...this.generateFieldDocumentation(field))
      }
      code.push(...this.generateFragmentDocumentation(interfac.possibleTypes))

      code.push('}')
    }

    /* Unions */
    for (const union of this.unions()) {
      code.push(`${union.name}: {`)

      /**
       * Only generate fragment selection for union.
       */
      code.push(...this.generateFragmentDocumentation(union.possibleTypes))

      code.push('}')
    }

    /* End documentation */
    code.push('}')

    return code
  }

  /**
   * This is a utility function for generating field documentation.
   * We use it in `generateDocumentation` function.
   *
   * We make sure that we always generate a function, even if it's a thunk.
   */
  generateFieldDocumentation(field: IntrospectionField): string[] {
    let chunks: string[] = []

    const fieldName = camel(field.name)
    const fieldType = getNamedTypeRef(field.type)
    const fieldRef = field.type

    /**
     * Documentation generation consists of three phases.
     * First, we generate arguments if they are present;
     * secondly, we generate selection if needed;
     * and thirdly, we generate return type of the function.
     */

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
         */
        const fieldTypeMapping = this.getTypeMapping(fieldType)
        const typelock = wrap(fieldTypeMapping, fieldRef)

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
      /* istanbul ignore next */
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
        chunks.push(wrap(this.getTypeMapping(fieldType), fieldRef))

        break
      /* Throw on unhandled. */
      /* istanbul ignore next */
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

    return [`${fieldName}: ${fn}`]
  }

  /**
   * A utility function that we use to generate documentation
   * for fragments. We use it in `generateDocumentation` function
   * when generating union and interface types.
   */
  generateFragmentDocumentation(
    objects: readonly IntrospectionNamedTypeRef<IntrospectionObjectType>[],
  ): string[] {
    let code: string[] = []

    /**
     * We create a separate selector for every possible interface.
     * All of them are required.
     */
    code.push(`on: <T>(selectors: {`)
    for (const object of objects) {
      const fieldName = camel(object.name)
      const typeName = this.getTypeMapping(object)

      code.push(`${fieldName}: SelectionSet<${typeName}, T>,`)
    }

    code.push(`}) => T`)

    return code
  }

  /* Selection */

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
      code.push(`${typeField}: <T>(selector: (fields: Documentation['${typeName}']) => T): SelectionSet<Object['${typeName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Object['${typeName}']>): T => {`)

      /* Types */
      code.push(`const types: Documentation['${typeName}'] = {`)

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
      code.push(`${interfaceField}: <T>(selector: (fields: Documentation['${interfaceName}']) => T): SelectionSet<Interface['${interfaceName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Interface['${interfaceName}']>): T => {`)

      /* Types */
      code.push(`const types: Documentation['${interfaceName}'] = {`)

      /**
       * We generate a selection function for every field in the interface,
       * and make a fragment selection on possible types.
       */
      for (const field of interfac.fields) {
        code.push(...this.generateField(field))
      }
      code.push(...this.generateFragments(interfac.possibleTypes))

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
      code.push(`${unionField}: <T>(selector: (fields: Documentation['${unionName}']) => T): SelectionSet<Union['${unionName}'], T> => {`)

      /* Decoder */
      /* prettier-ignore */
      code.push(`const decoder = (fields: Fields<Union['${unionName}']>): T => {`)

      /* Types */
      code.push(`const types: Documentation['${unionName}'] = {`)

      /**
       * Union types only have `on` function and we add it here as
       * a fragment selection.
       */
      code.push(...this.generateFragments(union.possibleTypes))

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

    /**
     * Thirdly, we generate selection.
     *
     * Selection makes a note in the fields object that ts-graphql
     * uses behind the scenes to generate the GraphQL query. We also
     * define the mock value here that we use while running the selector
     * without return values.
     */
    code.push(`/* Selection */`)
    switch (fieldType.kind) {
      /* Selection Types */
      case 'UNION':
      case 'INTERFACE':
      case 'OBJECT':
        /* prettier-ignore */
        code.push(`const field = composite('${field.name}', selection.fields, args)`)
        break

      /* Value Types */
      case 'SCALAR':
      case 'ENUM':
        /**
         * We use mocking function from utility functions to get the mock value.
         */
        code.push(`const field = leaf('${field.name}', args)`)

        break
      /* Throw on unknown. */
      /* istanbul ignore next */
      default: {
        throw new Error(`Unhandled fieldType ${fieldType.kind}`)
      }
    }

    code.push('fields.select(field)')

    /**
     * Lastly, we generate response decoders that will spit the
     * value from the response. Response may be of two different states.
     *
     * It's either
     *  - fetching: meaning we are running the script to get selection, or
     *  - fetched: meaning we have received the response and are
     * trying to decode it.
     */
    code.push(`/* Mock & Decoder */`)
    code.push(/* ts */ `
      const data = fields.data
      switch (data.type) {
        case 'fetching':
          return ${this.getTypeMock(fieldRef)}
        case 'fetched':
          return ${this.getTypeDecoder(field)}
      }  
    `)

    code.push('},')

    return code
  }

  /**
   * This function is a utility function for union and fragment
   * types. It generates fragment selections that developer may access
   * using `on` function.
   */
  generateFragments(
    objects: readonly IntrospectionNamedTypeRef<IntrospectionObjectType>[],
  ): string[] {
    let code: string[] = []

    /**
     * First create function definition
     */
    code.push(`on: <T>(selectors: {`)
    for (const object of objects) {
      const fieldName = camel(object.name)
      const typeLock = this.getTypeMapping(object)

      code.push(`${fieldName}: SelectionSet<${typeLock}, T>,`)
    }

    code.push(`}) => {`)

    /**
     * Create function selection.
     */
    code.push(`/* Selection */`)
    for (const object of objects) {
      const fieldName = camel(object.name)
      const fieldType = object.name

      /* prettier-ignore */
      code.push(`fields.select(fragment('${fieldType}', selectors.${fieldName}.fields))`)
    }
    code.push(os.EOL)

    /**
     * Create function decoder. We rely on __typename
     * field in the result to correctly select return object.
     */
    code.push(`
      /* Mock & Decoder */
      const data = fields.data
      switch (data.type) {
        case 'fetching':
          return selectors.${camel(objects[0].name!)}.mock
        case 'fetched':
          switch (data.response.typename) {
    `)

    for (const object of objects) {
      code.push(`case '${object.name}':`)
      /* prettier-ignore */
      code.push(`return selectors.${camel(object.name)}.decode(data.response.raw())`)
    }

    /* prettier-ignore */
    code.push("default: throw new Error(`Unknown type ${data.response.typename}`)")
    code.push(`}`)
    code.push(`}`)

    code.push('},')

    return code
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
    const type = getNamedTypeRef(ref)

    switch (type.kind) {
      /* Named */
      case 'ENUM':
        const id = `${pascal(type.name)}Enum`
        return this.getWrappedMockType(`Object.values(${id})[0]!`, ref)
      case 'SCALAR':
        return this.getWrappedMockType(`ScalarMock["${type.name}"]`, ref)
      /* Selections */
      case 'UNION':
      case 'OBJECT':
      case 'INTERFACE':
        return 'selection.mock'
      /* Missing */
      /* istanbul ignore next */
      default: {
        throw new Error(`Unknown reference type mock ${ref.kind}`)
      }
    }
  }

  /**
   * A utility function that wraps return value of enums or scalars
   * into list or nullable values. We use it when generating type mock.
   */
  getWrappedMockType(type: string, ref: IntrospectionTypeRef): string {
    const iref = invert(ref)

    switch (iref.kind) {
      case 'NULLABLE':
        return 'null'
      case 'LIST':
        return '[]'
      default:
        return type
    }
  }

  /**
   * Returns the expression that decodes the return value of the query.
   */
  getTypeDecoder(field: IntrospectionField): string {
    const ref = field.type
    const type = getNamedTypeRef(field.type)

    switch (type.kind) {
      /* Selection Types */
      case 'UNION':
      case 'INTERFACE':
      case 'OBJECT':
        return `selection.decode(data.response.get('${field.name}')(field.hash!))`
      /* Value Types */
      case 'SCALAR':
        const scalar = `ScalarDecoder.${type.name}`
        const decoder = this.getWrappedTypeDecoder(scalar, ref)
        return `${decoder}(data.response.get("${field.name}")(field.hash!))`
      case 'ENUM':
        // Enums are just strings that have a specific type annotation.
        const identity = `<T>(t: T) => t`
        const edecoder = this.getWrappedTypeDecoder(identity, ref)
        return `${edecoder}(data.response.get("${field.name}")(field.hash!))`
      /* Throw on unknown. */
      /* istanbul ignore next */
      default: {
        throw new Error(`Unhandled field kind ${type.kind} in field decoders.`)
      }
    }
  }

  /**
   * A utility function that wraps return value of enums or scalars
   * into list or nullable values. We use it when generating type mock.
   */
  getWrappedTypeDecoder(type: string, ref: IntrospectionTypeRef): string {
    return this.getWrappedTypeDecoderI(type, invert(ref))
  }

  /**
   * This is a private helper function that processes inverted introspection type.
   * Use `getWrappedTypeDecoder` instead.
   */
  private getWrappedTypeDecoderI(
    type: string,
    iref: IntrospectionInvertedTypeRef,
  ): string {
    switch (iref.kind) {
      case 'NULLABLE':
        return `nullable(${this.getWrappedTypeDecoderI(type, iref.ofType)})`
      case 'LIST':
        return `list(${this.getWrappedTypeDecoderI(type, iref.ofType)})`
      default:
        return type
    }
  }
}
