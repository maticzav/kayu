import {
  IntrospectionEnumType,
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

import { getNamedTypeRef } from './ast'
import { wrap } from './refs'
import { defined } from './utils'

type ScalarMap = Map<string, string>

export class GQLGenerator {
  /* State */

  private scalarMappings: ScalarMap
  private schema: IntrospectionSchema

  /* Initializer */

  constructor(schema: IntrospectionSchema, scalars: ScalarMap) {
    this.scalarMappings = scalars
    this.schema = schema
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
          objects.push(type)
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
          enums.push(type)
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
   * Generates the selection library.
   */
  generate(): string {
    /* Generates chunks of code */
    const code = [
      /* Imports */
      ...this.generateImports(),
    ].join(os.EOL)

    /* Formats the code. */

    const prettified = prettier.format(code, {
      parser: 'typescript',
    })

    return prettified
  }

  /**
   * Generates imports that library needs.
   */
  generateImports(): string[] {
    return [
      "import { composite, leaf, fragment, SelectionSet, Fields, selection } from './'",
    ]
  }

  /**
   * Generates index of scalar types the generated code uses.
   */
  generateScalars(): string[] {
    let code: string[] = []

    code.push('type Scalar = {')
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
   */
  generateObjectTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const type of this.objects()) {
      const id = `${type.name}Object`

      // Make a checkmark in the index.
      index.push(`${type.name}: ${id}`)

      // Push object definition code to types.
      code.push(`type ${id} = {`)
      for (const field of type.fields) {
        /**
         * - type contains the unwrapped indexed typed
         * - ref is the whole type that we use to calculate wrapper
         */
        const type = this.getTypeMapping(getNamedTypeRef(field.type))
        const ref = field.type

        code.push(`${field.name}: ${wrap(type, ref)}`)
      }
      code.push(`}`, os.EOL)
    }

    /**
     * Generate index at the end.
     */
    code.push(`type Object = {`)
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
     * Generate index using references.
     */
    code.push(`type Enum = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * Generates all the input objects that we may use as arguments.
   */
  generateInputObjects(): string[] {
    return []
  }

  generateInterfaces(): string[] {
    return []
  }

  generateUnions(): string[] {
    return []
  }

  /**
   * FieldTypes represent all the possible fields user may use to make a selection in a given type.
   * This function creates a type-dictionary of these fields (i.e. for each type in the schema one branch).
   */
  generateFieldTypes(): string[] {
    let code: string[] = ['type FieldsTypes = {']

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

        // Arguments
        if (field.args.length > 0) {
          let args: string[] = []

          for (const arg of field.args) {
            const type = this.getTypeMapping(getNamedTypeRef(arg.type))
            const ref = arg.type

            args.push(`${arg.name}: ${wrap(type, ref)}`)
          }

          chunks.push(`(args: { ${args.join(', ')} })`)
        }

        // Selection
        if (field.type.kind === 'LIST') {
        }

        // Make sure we at least have a thunk.
        if (chunks.length === 0) {
          chunks.push('()')
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
   * Generates the selection object.
   */
  generateSelections(): string[] {
    return []
  }

  /* Utility functions */

  /**
   * Returns the mapping to a given type in generated code.
   * We use this as a central point to document indexes.
   */
  getTypeMapping(type: IntrospectionNamedTypeRef): string {
    switch (type.kind) {
      case 'ENUM':
        return `Enum['${type.name}']`
      case 'OBJECT':
        return `Object['${type.name}']`
      case 'SCALAR':
        return `Scalar['${type.name}']`
      case 'INPUT_OBJECT':
        return `InputObject['${type.name}']`
      case 'INTERFACE':
        return `Interface['${type.name}']`
      case 'UNION':
        return `Union['${type.name}']`
    }
  }
}

/**
 *  NOTES:
 * - work on optional arguments
 */
