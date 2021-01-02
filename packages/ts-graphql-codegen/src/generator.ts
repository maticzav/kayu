import {
  IntrospectionEnumType,
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionNamedTypeRef,
  IntrospectionObjectType,
  IntrospectionScalarType,
  IntrospectionSchema,
  IntrospectionUnionType,
} from 'graphql'
import * as prettier from 'prettier'
import * as os from 'os'

import { getNamedTypeRef } from './ast'
import { wrap } from './refs'
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
      '/* Objects */',
      ...this.generateObjectTypes(),
      os.EOL,
      '/* Enums */',
      ...this.generateEnums(),
      os.EOL,
      '/* Input Objects */',
      ...this.generateInputObjects(),
      /* Field types */
      os.EOL,
      '/* Field Types */',
      ...this.generateFieldTypes(),
      /* Selections */
      os.EOL,
      '/* Selections */',
      ...this.generateObjects(),
      ...this.generateUnions(),
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
      "import { composite, leaf, fragment, SelectionSet, Fields, selection } from 'ts-graphql/src/__generator'",
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
   * Object type holds information about all return types from the schema and their
   * identifiers that we use as a reference for TypeLocks.
   *
   * We predefine identifiers to get better error messages and type
   * annotations by the IDE.
   *
   * TODO: this may also contain interfaces and union declarations.
   */
  generateObjectTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const type of this.objects()) {
      const name = pascal(type.name)
      const id = `${name}Object`

      // Make a checkmark in the index.
      index.push(`${name}: ${id}`)

      // Push object definition code to types.
      code.push(`type ${id} = {`)
      for (const field of type.fields) {
        /**
         * - type contains the unwrapped indexed typed
         * - ref is the whole type that we use to calculate wrapper
         */
        const type = this.getTypeMapping(getNamedTypeRef(field.type))
        const ref = field.type

        // TODO: { [hash: string]: wrap(type, ref) }
        code.push(`${field.name}: ${wrap(type, ref)}`)
      }
      code.push(`}`, os.EOL)
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

        const type = getNamedTypeRef(field.type)

        // Arguments
        if (field.args.length > 0) {
          let args: string[] = []

          for (const arg of field.args) {
            /**
             * We map each argument to a given type mapping
             * that references the generated code. We use the reference
             * to produce correct (wrapped) type value.
             */
            const type = this.getTypeMapping(getNamedTypeRef(arg.type))
            const ref = arg.type

            args.push(`${arg.name}: ${wrap(type, ref)}`)
          }

          chunks.push(`(args: { ${args.join(', ')} })`)
        }

        // Selection
        switch (type.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT': {
            /**
             * We defer unwrapping of values to developer land
             * and only make sure that the return type (i.e. typelock) here
             * matches the return value of the field.
             *
             * The `true` in wrapper indicates that nullable fields may be ommitted.
             */
            const ref = field.type
            const typelock = wrap(this.getTypeMapping(type), ref, true)
            chunks.push(`<T>(selection: SelectionSet<${typelock}, T>)`)
            break
          }
          /* Value Types */
          case 'SCALAR':
          case 'ENUM': {
            // Create a thunk if there's no parameters yet.
            if (chunks.length === 0) {
              chunks.push('()')
            }
          }
        }

        // Return type
        switch (type.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT': {
            chunks.push('T')
            break
          }
          /* Value Types */
          case 'SCALAR':
          case 'ENUM': {
            const ref = field.type
            chunks.push(wrap(this.getTypeMapping(type), ref))
          }
        }

        /**
         * We merge the chunks into a single function declaration string.
         */
        const fn: string = chunks
          .filter((chunk) => defined<string>(chunk))
          .join(' => ')
        code.push(`${field.name}: ${fn}`)
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
        const fieldName = camel(field.name)
        const fieldType = getNamedTypeRef(field.type)

        /**
         * First, we build function definition - that is the
         * arguments and everything that funciton needs to work
         * as expected.
         */
        let definition: string[] = []

        if (field.args.length > 0) {
          definition.push('(args)')
        }

        switch (fieldType.kind) {
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT': {
            definition.push('(selection)')
            break
          }
          case 'SCALAR':
          case 'ENUM': {
            // Create a thunk if there's no parameters yet.
            if (definition.length === 0) {
              definition.push('()')
            }
          }
        }

        definition.push('{')

        code.push(`${fieldName}: ${definition.join(' => ')}`)

        /**
         * Secondly, we generate selection. Selection
         * makes a note in the fields object that ts-graphql
         * uses behind the scenes and checks that this field will
         * be fetched as well.
         */
        switch (fieldType.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT': {
            /**
             * We get the internal mapping of the field type to
             * reference it in the Fields.
             */
            let fieldTypeName = this.getTypeMapping(fieldType)

            code.push(/* ts */ `
              let subfields = new Fields<${fieldTypeName}>()
              let mock = selection.decoder(subfields)
              fields.select(composite('${field.name}', subfields.selection))
            `)

            break
          }
          /* Value Types */
          case 'SCALAR':
          case 'ENUM': {
            code.push(/* ts */ `
              fields.select(leaf('${field.name}'))
              let mock = ""
            `)
          }
        }

        // Decoding & Mocking
        switch (fieldType.kind) {
          /* Selection Types */
          case 'UNION':
          case 'INTERFACE':
          case 'OBJECT': {
            /**
             * We get the internal mapping of the field type to
             * reference it in the Fields.
             */
            let fieldTypeName = this.getTypeMapping(fieldType)

            code.push(/* ts */ `
              const data = fields.data
              switch (data.type) {
                case 'fetching':
                  return mock
                case 'fetched':
                  let datasubfields = new Fields<${fieldTypeName}>(data.response["${field.name}"])
                  return selection.decoder(datasubfields)
              }
            `)

            break
          }
          /* Value Types */
          case 'SCALAR':
          case 'ENUM': {
            code.push(/* ts */ `
              const data = fields.data
              switch (data.type) {
                case 'fetching':
                  return mock
                case 'fetched':
                  return data.response["${field.name}"]
              }
            `)
          }
        }

        code.push('},')
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
   * TODO: interfaces
   */
  generateInterfaces(): string[] {
    return []
  }

  /**
   * TODO: unions
   */
  generateUnions(): string[] {
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
}
